import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sell, SellDocument } from 'src/schemas/sell.schema';
import { CreateSellDto } from './dto/create-sell.dto';
import { UpdateSellDto } from './dto/update-sell.dto';

@Injectable()
export class SellService {
  private readonly logger = new Logger(SellService.name);

  constructor(
    @InjectModel(Sell.name)
    private sellModel: Model<SellDocument>,
  ) {}

  async create(data: CreateSellDto) {
    this.logger.log(`Creating sell entry for ${data.tellUsForm.businessName}`);
    return this.sellModel.create(data);
  }

  async findAll() {
    return this.sellModel.find().exec();
  }

  async findOne(id: string) {
    const doc = await this.sellModel.findById(id).exec();
    if (!doc) {
      throw new NotFoundException(`Sell entry with id ${id} not found`);
    }
    return doc;
  }

  async update(id: string, data: UpdateSellDto) {
    const doc = await this.sellModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    if (!doc) {
      throw new NotFoundException(`Sell entry with id ${id} not found`);
    }
    return doc;
  }

  async remove(id: string) {
    const doc = await this.sellModel.findByIdAndDelete(id).exec();
    if (!doc) {
      throw new NotFoundException(`Sell entry with id ${id} not found`);
    }
    return doc;
  }
}
