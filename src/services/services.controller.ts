import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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

  @Post()
  @UseGuards(AuthGuard)
  @SetMetadata('roles', ['Admin', 'User'])
  async createServices(
    @Body() createService: CreateServiceDto,
    @Req() req: { user: UserData },
  ) {
    return this.servicesService.createService(createService, req.user._id);
  }

  @Get()
  async getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Get('/single-service/:id')
  async getSingleSerivce(@Param('id', ParseObjectIdPipe) id: string, @Body('lang') lang: string) {
    // console.log(id, lang)
    // return true
    return this.servicesService.getSingleSerivce(lang,id)
  }

  @Get('/services-by-category')
  async getServicesByCategory(@Body('category') category: string, @Body('lang') lang: string) {
    // return {category,lang}
    return this.servicesService.getServicesByCategory(lang, category)
  }

  @Get('get-all-products')
  async getAllProducts(@Body('lang') lang: string, @Body('category') category: string, @Body('search') search: string) {
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


}
