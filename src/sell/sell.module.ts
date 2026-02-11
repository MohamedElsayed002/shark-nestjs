import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sell, SellSchema } from 'src/schemas/sell.schema';
import { SellController } from './sell.controller';
import { SellService } from './sell.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sell.name, schema: SellSchema }]),
  ],
  controllers: [SellController],
  providers: [SellService],
})
export class SellModule {}
