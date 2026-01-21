import { Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/services.dto';
import { ServiceRepository } from './repostories/service.repository';
import { Services } from 'src/schemas/services.schema';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(private readonly serviceRepository: ServiceRepository) {}

  async createService(
    serviceData: CreateServiceDto,
    userId: any,
  ): Promise<Services> {
    this.logger.log(`Created Service by ${userId}`);

    const payload = {
      ...serviceData,
      owner: userId,
    };

    return this.serviceRepository.create(payload);
  }

  async getAllServices() {
    return this.serviceRepository.findAll();
  }

  async getSingleService(id: string) {
    return this.serviceRepository.findById(id);
  }

  async getAllUserService(id: string) {
    return this.serviceRepository.findAllUsersServices(id);
  }
}
