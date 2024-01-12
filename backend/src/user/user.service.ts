import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelType, Status } from '@prisma/client';
import { searchDto } from 'src/dto/search.dto';
import { SearchType } from 'src/dto/search.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async search(params: searchDto) {
    console.log(params);
    const findUsers = async (query) => {
      return await this.prisma.user.findMany({
        where: {
          username: {
            mode: 'insensitive',
            startsWith: query,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
    };
    const findChannels = async (query) => {
      return await this.prisma.channel.findMany({
        where: {
          name: {
            mode: 'insensitive',
            startsWith: query,
          },
          type: {
            in: [ChannelType.PUBLIC, ChannelType.PROTECTED],
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          type: true,
          Members: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
    };
    try {
      if (params.type === SearchType.USERS) {
        console.log('users');
        const users = await findUsers(params.query);
        return users;
      } else if (params.type === SearchType.CHANNELS) {
        console.log('channels');
        const channels = await findChannels(params.query);
        return channels;
      } else {
        console.log('all');
        const users = await findUsers(params.query);
        const channels = await findChannels(params.query);
        return { users, channels };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUSerProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          avatar: true,
          friends: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error('User Not Found');
      }
      // console.log(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendFriendRequest(body, userId) {
    try {
      const sender = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      });
      const receiver = await this.prisma.user.findUnique({
        where: { id: body.receiverId },
        select: {
          friends: { where: { id: userId } },
        },
      });
      if (
        !receiver ||
        userId === body.receiverId ||
        receiver.friends.length !== 0
      ) {
        throw new Error('Internal Server Error: cannotSendRequest');
      }
      const request =
        (await this.prisma.friendRequest.findFirst({
          where: {
            senderId: userId,
            receiverId: body.receiverId,
            status: Status.PENDING,
          },
        })) ||
        (await this.prisma.friendRequest.findFirst({
          where: {
            senderId: body.receiverId,
            receiverId: userId,
            status: Status.PENDING,
          },
        }));
      if (request) {
        throw new Error('Internal Server Error: Request Already Exists');
      }
      const newRequest = await this.prisma.friendRequest.create({
        data: {
          sender: {
            connect: {
              id: userId,
            },
          },
          receiver: {
            connect: {
              id: body.receiverId,
            },
          },
          status: Status.PENDING,
        },
      });
      if (!newRequest) {
        throw new Error('Failed to create record');
      }
      this.notifications.createNotification(userId, {
        receiverId: body.receiverId,
        type: NotificationType.FriendRequest,
        message: `${sender.username} has sent you a friend request`,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelFriendRequest(friendRequest, userId) {
    try {
      if (
        friendRequest.senderId !== userId ||
        friendRequest.status !== Status.PENDING
      ) {
        throw new Error('Internal Server Error: CannotCancelRequest');
      }
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.CANCELED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async declineFriendRequest(friendRequest, userId) {
    try {
      if (
        friendRequest.receiverId !== userId ||
        friendRequest.status !== Status.PENDING
      )
        return {
          msg: 'Internal Server Error: CannotDeclineRequest',
        };
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.DECLINED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async acceptFriendRequest(friendRequest, userId) {
    try {
      if (
        friendRequest.receiverId !== userId ||
        friendRequest.status !== Status.PENDING
      ) {
        throw new Error('Internal Server Error: CannotAcceptRequest');
      }
      const addSender = this.prisma.user.update({
        where: {
          id: friendRequest.senderId,
        },
        data: {
          friends: { connect: [{ id: friendRequest.receiverId }] },
        },
      });
      const addReceiver = this.prisma.user.update({
        where: {
          id: friendRequest.receiverId,
        },
        data: {
          friends: { connect: [{ id: friendRequest.senderId }] },
        },
      });
      await this.prisma.$transaction([addSender, addReceiver]);
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.ACCEPTED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async unfriendUser(friendId, userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          friends: {
            where: {
              id: friendId,
            },
          },
        },
      });
      if (!user.friends.length) {
        throw new Error('Internal Server Error: CannotUnfriendUser');
      }
      const removeUserA = this.prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
        },
        include: {
          friends: { select: { username: true } },
        },
      });
      const removeUserB = this.prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: {
              id: userId,
            },
          },
        },
        include: {
          friends: { select: { username: true } },
        },
      });
      await this.prisma.$transaction([removeUserA, removeUserB]);
      return { msg: 'Success' };
    } catch {
      throw new InternalServerErrorException(
        'Internal Server Error: CannotUnfriendUser',
      );
    }
  }
}
