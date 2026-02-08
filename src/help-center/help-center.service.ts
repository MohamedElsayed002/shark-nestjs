import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HelpCenter, HelpCenterDoucment } from 'src/schemas/help-center';
import { CreateHelpCenterDto } from './dto/help-center.dto';

@Injectable()
export class HelpCenterService {
    private readonly logger = new Logger(HelpCenterService.name);

    constructor(
        @InjectModel(HelpCenter.name)
        private helpCenterModel: Model<HelpCenterDoucment>,
    ) {}

    async createHelpCenter(data: CreateHelpCenterDto) {
        this.logger.log(`Creating help center for ${data.email}`);
        return this.helpCenterModel.create(data);
    }

    async getAllHelpCenter() {
        this.logger.log('Getting all help center')
        return this.helpCenterModel.find().exec()
    }
}
