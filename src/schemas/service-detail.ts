import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ServiceDetailsDocument = HydratedDocument<ServiceDetail>;

@Schema({ timestamps: true })
export class ServiceDetail {

  @Prop({type: String,index: true})
  lang: string 

  @Prop({required: true})
  title: string 

  @Prop({required: true})
  slug: string 

  @Prop({required: true})
  description: string
}

export const ServiceDetailsSchema = SchemaFactory.createForClass(ServiceDetail);
