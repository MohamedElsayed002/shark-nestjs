import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/services.dto';
import { AuthGuard } from 'src/guard/auth-guard';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) { }

  // Create Service
  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['Admin', 'User'])
  async createServices(
    @Body() createService: CreateServiceDto,
    @Req() req: { user: UserData },
  ) {
    return this.servicesService.createService(createService, req.user._id);
  }

  // ALL Services without verificaiton
  @Get()
  async getAllServices() {
    return this.servicesService.getAllServices();
  }

  // All Services with verification
  @Get('/verified-services')
  async getAllVerifiedServices() {
    return this.servicesService.getAllVerifiedServices()
  }

  // Single Service for Admin both English and Arabic
  @Get('/single-service/:id')
  async getSingleSerivce(@Param('id', ParseObjectIdPipe) id: string) {
    return this.servicesService.getSingleSerivceReview(id)
  }

  // Single Service for Users
  @Get('/single-service-users/:id')
  async getSingleServiceUsersReview(@Param('id', ParseObjectIdPipe) id: string) {
    return this.servicesService.getSingleServiceUsersReview(id)
  }

  // Verify Servicd
  @Patch('/update-service-verification/:id')
  async updateServiceVerification(@Param('id', ParseObjectIdPipe) id: string, @Body('verification') verification: boolean) {
    return this.servicesService.updateService(id, verification)
  }


  @Get('/services-by-category')
  async getServicesByCategory(@Body('category') category: string, @Body('lang') lang: string) {
    // return {category,lang}
    return this.servicesService.getServicesByCategory(lang, category)
  }

  @Get('get-all-products')
  async getAllProducts(@Query('lang') lang: string, @Query('category') category: string, @Query('search') search: string) {
    return this.servicesService.getAllProducts(lang, category, search)
  }

  @Get(':id')
  async getSingleService(@Param('id', ParseObjectIdPipe) id: string) {
    return this.servicesService.getSingleService(id);
  }

  @Get('user/:id')
  async getUserServices(@Param('id', ParseObjectIdPipe) id: string) {
    return this.servicesService.getAllUserService(id);
  }


  @Delete(':id')
  async deleteService(@Param('id',ParseObjectIdPipe) id: string) {
    return this.servicesService.deleteService(id)
  }
}
