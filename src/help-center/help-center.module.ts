import { Module } from '@nestjs/common';
import { HelpCenterController } from './help-center.controller';
import { HelpCenterService } from './help-center.service';
import { Mongoose } from 'mongoose';
import { HelpCenter, HelpCenterSchema } from 'src/schemas/help-center';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: HelpCenter.name, schema: HelpCenterSchema}])
  ],
  controllers: [HelpCenterController],
  providers: [HelpCenterService]
})
export class HelpCenterModule {}
