import {
  Body,
  Controller,
  Delete,
  Get,
  BadRequestException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatGuard } from 'src/guards/chat.jwt.guard';
import { DirectMessagesService } from './direct-messages.service';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(ChatGuard)
@Controller('direct')
export class directMessagesController {
  constructor(
    private readonly DMsService: DirectMessagesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('/new')
  async newChat(@Body() body, @Req() req) {
    if (!req.userID || !body.friendId || !body.friendId.length) {
      throw new BadRequestException();
    }
    return this.DMsService.newChat(body.friendId, req.userID);
  }

  @Get('/all')
  async getUsersChats(@Req() req) {
    if (!req.userID) {
      throw new BadRequestException();
    }
    return this.DMsService.getUserChats(req.userID);
  }

  @Get(':id')
  async getChatById(@Req() req, @Param('id') chatId) {
    if (!req.userID) {
      throw new BadRequestException();
    }
    return this.DMsService.getChatById(chatId);
  }

  @Delete('all')
  async clearChats() {
    return this.prisma.chat.deleteMany();
  }
}
