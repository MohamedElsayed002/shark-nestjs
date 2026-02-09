import { Body, Controller, Get, Param, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guard/auth-guard';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
@SetMetadata('roles', ['Admin', 'User'])
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  async createOrGet(
    @Body() dto: CreateConversationDto,
    @Req() req: { user: UserData },
  ) {
    const buyerId = req.user._id;
    return this.conversationService.createOrGetConversation(
      buyerId,
      dto.sellerId,
      dto.serviceId,
    );
  }

  @Get()
  async list(@Req() req: { user: UserData }) {
    return this.conversationService.getConversationsForUser(req.user._id);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseObjectIdPipe) id: string,
    @Req() req: { user: UserData },
  ) {
    return this.conversationService.getConversationById(id, req.user._id);
  }

  @Post(':id/messages')
  async sendMessage(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: SendMessageDto,
    @Req() req: { user: UserData },
  ) {
    return this.conversationService.sendMessage(id, req.user._id, dto.content);
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('cursor') cursor: string | undefined,
    @Query('limit') limit: string | undefined,
    @Req() req: { user: UserData },
  ) {
    const limitNum = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
    return this.conversationService.getMessages(
      id,
      req.user._id,
      cursor,
      limitNum,
    );
  }
}
