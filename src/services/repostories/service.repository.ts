import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Services } from 'src/schemas/services.schema';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectModel(Services.name)
    private readonly serviceModel: Model<Services>,
  ) {}

  findAll() {
    return this.serviceModel.find().exec();
  }

  findById(id: string) {
    return this.serviceModel.findById(id);
  }

  findAllUsersServices(id: string) {
    return this.serviceModel.find({ owner: id }).exec();
  }

  create(data: Partial<Services>) {
    const services = new this.serviceModel(data);
    return services.save();
  }
}
