import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Auth } from './auth.schema';
import { Services } from './services.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Auth.name }],
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Services.name, default: null })
  serviceId: Types.ObjectId | null;

  @Prop({ type: Date, default: null })
  lastMessageAt: Date | null;

  @Prop({ default: '', maxlength: 200 })
  lastMessagePreview: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// Non-unique index for fast lookups. Uniqueness is enforced in app (findOne before create).
// Do NOT use unique: true here: with an array field, MongoDB multikey index would allow
// only one conversation per (participant, serviceId), blocking multiple buyers for the same seller+service.
ConversationSchema.index({ participants: 1, serviceId: 1 });
