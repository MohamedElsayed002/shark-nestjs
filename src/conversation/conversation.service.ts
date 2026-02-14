import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from 'src/schemas/conversation.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';

const MAX_PREVIEW_LENGTH = 80;
const DEFAULT_MESSAGES_LIMIT = 50;
const OLD_UNIQUE_INDEX_NAME = 'participants_1_serviceId_1';

@Injectable()
export class ConversationService implements OnModuleInit {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async onModuleInit() {
    try {
      await this.conversationModel.collection.dropIndex(OLD_UNIQUE_INDEX_NAME);
      this.logger.log(`Dropped old unique index: ${OLD_UNIQUE_INDEX_NAME}`);
    } catch {
      // Index may not exist or already dropped – ignore
    }
  }

  /** Normalize participants to [smallerId, biggerId] for consistent lookup */
  private normalizeParticipants(id1: string, id2: string): Types.ObjectId[] {
    const a = new Types.ObjectId(id1);
    const b = new Types.ObjectId(id2);
    return [a, b].sort((x, y) => x.toString().localeCompare(y.toString()));
  }

  /** Ensure user is a participant in the conversation */
  private async assertParticipant(
    conversationId: string,
    userId: string,
  ): Promise<ConversationDocument> {
    const conv = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (!conv) {
      throw new NotFoundException(`Conversation not found`);
    }
    const userObjId = new Types.ObjectId(userId);
    const isParticipant = conv.participants.some(
      (p) => p.toString() === userObjId.toString(),
    );
    if (!isParticipant) {
      throw new ForbiddenException(`You are not a participant in this conversation`);
    }
    return conv;
  }

  async createOrGetConversation(
    buyerId: string,
    sellerId: string,
    serviceId?: string,
  ): Promise<ConversationDocument> {
    if (buyerId === sellerId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }
    const participants = this.normalizeParticipants(buyerId, sellerId);
    const serviceIdObj = serviceId ? new Types.ObjectId(serviceId) : null;

    // Match both null and missing serviceId so we find existing docs regardless of schema default
    const filter: mongoose.FilterQuery<ConversationDocument> = {
      participants: { $all: participants },
      ...(serviceIdObj
        ? { serviceId: serviceIdObj }
        : { $or: [{ serviceId: null }, { serviceId: { $exists: false } }] }),
    };
    let conversation = await this.conversationModel.findOne(filter).exec();

    if (conversation) {
      return conversation.populate([
        { path: 'participants', select: 'name email imageUrl location country partnerDescription firstName lastName' },
        { path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } },
      ]) as Promise<ConversationDocument>;
    }

    try {
      const created = await this.conversationModel.create({
        participants,
        serviceId: serviceIdObj,
        lastMessageAt: null,
        lastMessagePreview: '',
      });
      return created.populate([
        { path: 'participants', select: 'name email imageUrl location country partnerDescription firstName lastName' },
        { path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } },
      ]) as Promise<ConversationDocument>;
    } catch (err: unknown) {
      // E11000: duplicate key (e.g. old unique index still in DB) – find and return existing
      const code = (err as { code?: number })?.code;
      if (code === 11000) {
        conversation = await this.conversationModel.findOne(filter).exec();
        if (conversation) {
          return conversation.populate([
            { path: 'participants', select: 'name email imageUrl location country partnerDescription firstName lastName' },
            { path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } },
          ]) as Promise<ConversationDocument>;
        }
        // Index blocks insert but we didn't find by filter (e.g. multikey uniqueness)
        // Try find by serviceId + either participant
        if (serviceIdObj) {
          conversation = await this.conversationModel
            .findOne({
              serviceId: serviceIdObj,
              participants: { $in: participants },
            })
            .exec();
          if (conversation) {
            return conversation.populate([
              { path: 'participants', select: 'name email imageUrl location country partnerDescription firstName lastName' },
              { path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } },
            ]) as Promise<ConversationDocument>;
          }
        }
      }
      throw err;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const userObjId = new Types.ObjectId(userId);
    const convs = await this.conversationModel
      .find({ participants: userObjId })
      .select('_id')
      .lean()
      .exec();
    const convIds = convs.map((c) => c._id);
    if (convIds.length === 0) return 0;
    return this.messageModel
      .countDocuments({
        conversationId: { $in: convIds },
        senderId: { $ne: userObjId },
        readBy: { $nin: [userObjId] },
      })
      .exec();
  }

  async getConversationsForUser(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const list = await this.conversationModel
      .find({ participants: userObjId })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .populate('participants', 'name email imageUrl location country partnerDescription firstName lastName')
      .populate({ path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } })
      .lean()
      .exec();
    const convIds = list.map((c) => c._id);
    if (convIds.length === 0) return list;
    const unreadCounts = await this.messageModel
      .aggregate<{ _id: Types.ObjectId; count: number }>([
        {
          $match: {
            conversationId: { $in: convIds },
            senderId: { $ne: userObjId },
            readBy: { $nin: [userObjId] },
          },
        },
        { $group: { _id: '$conversationId', count: { $sum: 1 } } },
      ])
      .exec();
    const countByConv = new Map(
      unreadCounts.map((r) => [r._id.toString(), r.count]),
    );
    return list.map((conv) => ({
      ...conv,
      unreadCount: countByConv.get(conv._id.toString()) ?? 0,
    }));
  }

  async getConversationById(
    conversationId: string,
    userId: string,
  ): Promise<ConversationDocument> {
    const conv = await this.assertParticipant(conversationId, userId);
    return conv.populate([
      { path: 'participants', select: 'name email imageUrl location country partnerDescription firstName lastName' },
      { path: 'serviceId', select: 'imageUrl category', populate: { path: 'details', select: 'lang title' } },
    ]) as Promise<ConversationDocument>;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ): Promise<MessageDocument> {
    await this.assertParticipant(conversationId, senderId);
    const trimmed = content.trim();
    if (!trimmed) {
      throw new BadRequestException('Message content cannot be empty');
    }

    const message = await this.messageModel.create({
      conversationId: new Types.ObjectId(conversationId),
      senderId: new Types.ObjectId(senderId),
      content: trimmed,
      readBy: [senderId],
    });

    const preview =
      trimmed.length > MAX_PREVIEW_LENGTH
        ? trimmed.slice(0, MAX_PREVIEW_LENGTH) + '...'
        : trimmed;

    await this.conversationModel
      .findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
        lastMessagePreview: preview,
      })
      .exec();

    return message.populate('senderId', 'name') as Promise<MessageDocument>;
  }

  async getMessages(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit: number = DEFAULT_MESSAGES_LIMIT,
  ) {
    await this.assertParticipant(conversationId, userId);
    const userObjId = new Types.ObjectId(userId);
    const convObjId = new Types.ObjectId(conversationId);
    await this.messageModel
      .updateMany(
        {
          conversationId: convObjId,
          readBy: { $nin: [userObjId] },
        },
        { $addToSet: { readBy: userObjId } },
      )
      .exec();

    const query: mongoose.FilterQuery<MessageDocument> = {
      conversationId: new Types.ObjectId(conversationId),
    };
    if (cursor) {
      const cursorDoc = await this.messageModel.findById(cursor).exec();
      if (cursorDoc) {
        const cursorDate = (cursorDoc as unknown as { createdAt?: Date }).createdAt;
        if (cursorDate) query.createdAt = { $lt: cursorDate };
      }
    }

    const messages = await this.messageModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate('senderId', 'name')
      .lean()
      .exec();

    const hasMore = messages.length > limit;
    const items = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return {
      messages: items.reverse(),
      nextCursor,
      hasMore,
    };
  }
}
