import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import  { Model, FilterQuery  } from 'mongoose';
import { Services, ServicesDocument } from 'src/schemas/services.schema';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectModel(Services.name)
    private readonly serviceModel: Model<Services>,
  ) {}


  create(data: Partial<Services>): Promise<ServicesDocument> {
    const service = new this.serviceModel(data)
    return service.save()
  }

  findById(id: string) {
    return this.serviceModel.findById(id)
  }

  findOne(filter: FilterQuery<ServicesDocument>) {
    return this.serviceModel.findOne(filter)
  }

  findAll() {
    return this.serviceModel.find({platformVerificationRequested: false}).exec()
  }

  findAllVerified() {
    return this.serviceModel.find({platformVerificationRequested: true}).exec()
  }

  find(filter: FilterQuery<ServicesDocument>) {
    return this.serviceModel.find(filter)
  }

  findWithDetails(filter: FilterQuery<ServicesDocument>,lang: string) {
    return this.serviceModel.find(filter).populate({path: 'details',match: {lang}})
  }

  findAllUsersServices(userId: string) {
    return this.serviceModel.find({owner: userId})
  }

  findOneWithDetails(filter: FilterQuery<ServicesDocument>,lang: string) {
    return this.serviceModel.findOne(filter).populate({path: 'details',match: {lang}})
  }

  updateById(id: string, update: Partial<Services>) {
    return this.serviceModel.findByIdAndUpdate(id,update,{new: true})
  }

  deleteById(id: string) {
    return this.serviceModel.findByIdAndDelete(id)
  }

  countByCategory(category: string) {
    return this.serviceModel.countDocuments({category})
  }

  distinctCategories() {
    return this.serviceModel.distinct('category')
  }

}
