import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Auth } from './auth.schema';
import { Conversation } from './conversation.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Conversation.name, required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Auth.name, required: true })
  senderId: Types.ObjectId;

  @Prop({ required: true, maxlength: 4000 })
  content: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Auth.name, default: [] })
  readBy: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
