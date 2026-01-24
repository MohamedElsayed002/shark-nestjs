import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ServiceDetail, ServiceDetailsDocument } from "src/schemas/service-detail";
import { ServiceRepository } from "./repostories/service.repository";


@Injectable()
export class ServiceSearchService {
    constructor(
        private readonly serviceRepo: ServiceRepository,
        @InjectModel(ServiceDetail.name)
        private readonly serviceDetailModel: Model<ServiceDetailsDocument>
    ) { }

    async validateLang(lang: string): Promise<boolean> {
        const validLangs = await this.serviceDetailModel.distinct('lang').exec()
        return validLangs.includes(lang)
    }

    async buildFilterByLangCategorySearch(
        lang: string,
        category?: string,
        search?: string
    ): Promise<Record<string, any> | null> {

        const detailQuery: any = { lang }

        // Safely trim only if it's actually a string
        const trimmedSearch = typeof search === 'string' ? search.trim() : ''

        if (trimmedSearch) {
            detailQuery.title = { $regex: trimmedSearch, $options: 'i' }
        }

        const serviceDetials = await this.serviceDetailModel.find(detailQuery).exec()
        const detailIds = serviceDetials.map((detail) => detail._id)

        const filter: any = {}

        // Safely trim category
        const trimmedCategory = typeof category === 'string' ? category.trim() : ''

        if (trimmedCategory) {
            const validCategories = await this.serviceRepo.distinctCategories()
            if (validCategories.includes(trimmedCategory)) {
                filter.category = trimmedCategory
                const categoryCheck = await this.serviceRepo.countByCategory(trimmedCategory)
                if (categoryCheck === 0) {
                    return null
                }
            } else {
                // optional: if category provided but invalid, return null or ignore
                return null
            }
        }

        if (trimmedSearch && detailIds.length > 0) {
            filter.details = { $in: detailIds }
        } else if (trimmedSearch && detailIds.length === 0) {
            return null
        }

        return filter
    }

}