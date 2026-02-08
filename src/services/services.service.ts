import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/services.dto';
import { ServiceRepository } from './repostories/service.repository';
import slugify from 'slugify';
import { ServiceSearchService } from './product-search-serivce';
import { ServiceDetail, ServiceDetailsDocument } from 'src/schemas/service-detail';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Services, ServicesDocument } from 'src/schemas/services.schema';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly servicesSearchService: ServiceSearchService,
    @InjectModel(ServiceDetail.name)
    private serviceDetailModel: Model<ServiceDetailsDocument>,

    @InjectModel(Services.name)
    private serviceModel: Model<ServicesDocument>,
  ) { }


  async isTitleTaken(title: string): Promise<boolean> {
    const product = await this.serviceDetailModel.findOne({ title })
    return !!product
  }

  async createService(
    serviceData: CreateServiceDto,
    userId: any,
  ) {
    this.logger.log(`Created Service by ${userId}`);


    if (!serviceData.details || serviceData.details.length !== 2) {
      throw new BadRequestException('Product must have exactly one Arabic and one English detail')
    }

    if (!serviceData.category) {
      throw new BadRequestException('Category is required')
    }

    const slugs = serviceData.details.map((detail) => ({
      ...detail,
      slug: detail.lang === 'ar' ? detail.title.replace(/\s+/g, '-') :
        slugify(detail.title, { lower: true, strict: true })
    }))

    const existingSlug = await this.serviceDetailModel.findOne({
      slug: { $in: slugs.map((d) => d.slug) }
    })

    if (existingSlug) {
      throw new BadRequestException(`A service detail with the slug ${existingSlug.slug} already exists`)
    }

    const service = await this.serviceRepository.create({
      category: serviceData.category,
      owner: userId,
      imageUrl: serviceData.imageUrl || '',
      isProfitable: serviceData.isProfitable || false,
      revenueProofs: Array.isArray(serviceData.revenueProofs) ? serviceData.revenueProofs : [],
      averageMonthlyExpenses: serviceData.averageMonthlyExpenses || 0,
      averageMonthlyRevenue: serviceData.averageMonthlyRevenue || 0,
      incomeSources: serviceData.incomeSources || [],
      verificationLevel: serviceData.verificationLevel || "basic",
      netProfit: serviceData.netProfit || 0,
      platformVerificationRequested: false
    })

    const details: mongoose.Types.ObjectId[] = []

    for (const detailData of slugs) {
      const detail = new this.serviceDetailModel(detailData)
      await detail.save()
      details.push(detail._id as mongoose.Types.ObjectId)
    }

    const populatedDetails = await this.serviceDetailModel
      .find({ _id: { $in: details } }).exec()

    const updated = await this.serviceRepository.updateById(String(service._id), {
      details: populatedDetails as any
    })

    return updated as any
  }

  async getAllProducts(
    lang: string,
    category: string = '',
    search: string = ''
  ): Promise<ServicesDocument[]> {

    try {
      const validLang = await this.servicesSearchService.validateLang(lang)

      if (!validLang) {
        console.log(`Invalid lang: ${lang}`)
        return []
      }

      // Step 2: Query Product Detail for matching title and lang
      const filter = await this.servicesSearchService.buildFilterByLangCategorySearch(
        lang,
        category,
        search
      )

      if (filter === null) {
        console.log(`No matching ProductDetails found for search, return empty`)
        return []
      }

      const products = await this.serviceRepository.findWithDetails(
        { ...filter, platformVerificationRequested: true },
        lang
      ).exec()

      const filteredProducts = products.filter(
        (product) => product.details.length > 0
      )

      if (filteredProducts.length === 0 && products.length > 0) {
        console.log(`All Products filtered out due to empty details after population`)
      } else if (filteredProducts.length === 0) {
        console.log('No products found matching the criteria')
      }

      return filteredProducts

    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);

    }
  }

  async getAllServices() {
    return this.serviceRepository.findAll()
  }

  async getAllVerifiedServices() {
    return this.serviceRepository.findAllVerified()
  }

  async getAllServicesDetails() {
    // Assuming you want to populate details after finding all services
    const services = await this.serviceRepository.findAll();
    // Populate details manually for each service, if needed
    return this.serviceDetailModel.populate(services, { path: 'details' });
  }

  async getSingleService(id: string) {
    return this.serviceRepository.findById(id);
  }


  // TODO: Not need to send the id of the user 
  async getAllUserService(id: string) {
    return this.serviceRepository.findAllUsersServices(id);
  }


  async getServicesByCategory(lang: string, category: string) {
    return this.serviceRepository.findWithDetails({ category }, lang)
  }

  async getSingleSerivceReview(serviceId: string) {
    const service = await this.serviceRepository.findById(serviceId).populate({
      path: 'details',
      // match: {lang}
    })
    if (!service || !service.details || service.details.length === 0) {
      throw new BadRequestException(`Product not found with id ${serviceId}`)
    }

    return service
  }

  async getSingleServiceUsersReview(serviceId: string) {
    const service = await this.serviceRepository.findById(serviceId).populate({
      path: 'details',
      // match: {lang}
    }).populate({path: 'owner'})
    if (!service || !service.details || service.details.length === 0) {
      throw new BadRequestException(`Product not found with id ${serviceId}`)
    }

    return service
  }

  async updateService(serviceId: string, verification: boolean) {
    return this.serviceModel.findByIdAndUpdate(
      serviceId,
      { platformVerificationRequested: verification },
      { new: true }
    )
  }

  async deleteService(serviceId: string) {
    const service = await this.serviceModel.findById(serviceId)

    if (!service) {
      throw new BadRequestException(`Service not found with id ${serviceId}`)
    }

    // if (service.platformVerificationRequested) {
    //   throw new BadRequestException(`Service is already verified`)
    // }

    // 1. Delete all detail documents referenced in service.details

    if(service.details?.length) {
      await this.serviceDetailModel.deleteMany({
        _id: { $in: service.details}
      })
    }

    // 2. Delete the service document itself
    await this.serviceModel.findByIdAndDelete(serviceId)

    return {
      message: `Service deleted successfully`,
    }
  }

}
