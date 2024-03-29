import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DirectMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async newChat(friendId: string, userID: string) {
    try {
      let chat =
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: userID,
            user2Id: friendId,
          },
          include: {
            myfriend: true,
            myself: true,
          },
        })) ||
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: friendId,
            user2Id: userID,
          },
          include: {
            myfriend: true,
            myself: true,
          },
        }));
      if (!chat) {
        if (friendId === userID) {
          throw new Error('Invalid operation: duplicated user');
        }
        const user = await this.prisma.user.findUnique({
          where: { id: friendId },
          include: { friends: true },
        });
        if (!user) {
          throw new Error('User Not Found');
        }
        if (user.friends.map((friend) => friend.id).indexOf(userID) === -1) {
          throw new Error('Invalid operation: users are not friends');
        }
        chat = await this.prisma.chat.create({
          data: {
            myself: {
              connect: {
                id: userID,
              },
            },
            myfriend: {
              connect: {
                id: friendId,
              },
            },
          },
          include: {
            myfriend: true,
            myself: true,
          },
        });
        if (!chat) {
          throw new Error('Failed to start Chat');
        }
      }
      delete chat?.myfriend.password;
      delete chat?.myself.password;
      return chat;
    } catch (error) {
      // console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }

  async getUserChats(userID: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userID },
        include: {
          startedChats: {
            include: {
              messages: true,
            },
          },
          invitedChats: {
            include: {
              messages: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error('User Not Found');
      }
      return [...user.startedChats, ...user.invitedChats];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getChatById(chatId: string) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          myfriend: {
            select: {
              id: true,
              username: true,
            },
          },
          myself: {
            select: {
              id: true,
              username: true,
            },
          },
          messages: true,
        },
      });
      if (!chat) {
        throw new Error('Chat not found');
      }
      return chat;
    } catch (error) {
      // console.log(error.message);
      throw new BadRequestException(error.message);
    }
  }
}
