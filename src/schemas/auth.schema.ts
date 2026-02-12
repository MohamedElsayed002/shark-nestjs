import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  phone: string;

  @Prop()
  verificationCode: string;

  @Prop()
  codeExpiresAt: Date;

  @Prop({ default: 'Male', enum: ['Male', 'Female'] })
  gender: string;

  @Prop({ default: 'User', enum: ['User', 'Admin'] })
  role: string;

  /** Set to true after user completes onboarding; used to redirect first-time users */
  @Prop({ default: false })
  onboardingCompleted: boolean;

  @Prop({ type: String, enum: ['buyer', 'seller', 'find_partner'], default: null })
  accountType: string | null;

  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '' })
  country: string;

  @Prop({ default: '', maxlength: 2000 })
  partnerDescription: string;

  @Prop({ default: '' })
  companyName: string;

  @Prop({ default: '' })
  howHeard: string;

  @Prop({ default: '' })
  businessUrl: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ default: '' })
  annualRevenue: string;

  @Prop({ default: '' })
  annualProfit: string;

  @Prop({ default: '' })
  businessesCount: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
