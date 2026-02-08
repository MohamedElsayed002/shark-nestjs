import { Body, Controller, Get, Post } from '@nestjs/common';
import { HelpCenterService } from './help-center.service';
import { CreateHelpCenterDto } from './dto/help-center.dto';

@Controller('help-center')
export class HelpCenterController {
  constructor(private readonly helpCenterService: HelpCenterService) {}

  @Post()
  async create(@Body() data: CreateHelpCenterDto) {
    return this.helpCenterService.createHelpCenter(data);
  }

  @Get()
  async getAll() {
    return this.helpCenterService.getAllHelpCenter()
  }
}
