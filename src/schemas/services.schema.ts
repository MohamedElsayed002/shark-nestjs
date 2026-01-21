import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Auth } from './auth.schema';

export type ServicesDocument = HydratedDocument<Services>;

@Schema({ timestamps: true })
export class Services {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Auth.name })
  owner: Types.ObjectId;

  @Prop()
  imageUrl: string;

  @Prop()
  imageId: string;

  @Prop({ required: true })
  category: string;

  @Prop({ default: false })
  isProfitable: boolean;

  @Prop()
  averageMonthlyRevenue: number;

  @Prop()
  averageMonthlyExpenses: number;

  @Prop()
  netProfit: number;

  // Income Sources ['adsense', 'subscriptions', 'digital_products', 'affiliate', 'services', 'apps']
  @Prop({ type: [String] })
  incomeSources: string[];

  // Revenue Proofs
  @Prop([
    {
      fileUrl: String,
      fileId: String,
      fileType: String,
      source: String,
    },
  ])
  revenueProofs: {
    fileUrl: string;
    fileId: string;
    fileType: string;
    source?: string;
  }[];

  // Verification
  @Prop({ default: false })
  platformVerificationRequested: boolean;

  @Prop({ default: 'basic' })
  verificationLevel: 'basic' | 'approved' | 'rejected';
}

export const ServicesSchema = SchemaFactory.createForClass(Services);
