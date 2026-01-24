import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ServiceRepository } from './repostories/service.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from 'src/schemas/auth.schema';
import { Services, ServicesSchema } from 'src/schemas/services.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ServiceDetail, ServiceDetailsSchema } from 'src/schemas/service-detail';
import { ServiceSearchService } from './product-search-serivce';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema },
      { name: Services.name, schema: ServicesSchema },
      { name: ServiceDetail.name, schema: ServiceDetailsSchema},
    ]),
    AuthModule,
  ],
  providers: [ServicesService, ServiceRepository,ServiceSearchService],
  controllers: [ServicesController],
})
export class ServicesModule {}
