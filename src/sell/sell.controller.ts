import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SellService } from './sell.service';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('sell')
export class SellController {
  constructor(private readonly sellService: SellService) {}

  @Post()
  create(@Body() data: CreateSellDto) {
    return this.sellService.create(data);
  }

  @Get()
  findAll() {
    return this.sellService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.sellService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() data: UpdateSellDto,
  ) {
    return this.sellService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.sellService.remove(id);
  }
}
