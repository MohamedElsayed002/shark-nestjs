import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SellDocument = HydratedDocument<Sell>;

@Schema({ timestamps: true })
export class Sell {
  @Prop({
    required: true,
    type: {
      id: Number,
      icon: { displayName: String },
      titleKey: String,
      descriptionKey: String,
    },
  })
  category: {
    id: number;
    icon: { displayName: string };
    titleKey: string;
    descriptionKey: string;
  };

  @Prop({
    required: true,
    type: {
      businessName: String,
      businessUrl: String,
      startDateMonth: String,
      startDateYear: String,
      businessLocation: String,
      industry: String,
      siteType: String,
      currency: String,
      annualRevenue: String,
    },
  })
  tellUsForm: {
    businessName: string;
    businessUrl: string;
    startDateMonth: string;
    startDateYear: string;
    businessLocation: string;
    industry: string;
    siteType: string;
    currency: string;
    annualRevenue: string;
  };

  @Prop({ type: [String], default: [] })
  incomeSources: string[];
}

export const SellSchema = SchemaFactory.createForClass(Sell);
