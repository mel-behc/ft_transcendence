import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
// import { NotificationsController } from './notifications.controller';
import { Server, Socket } from 'socket.io';
import { validateToken } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { NotificationType } from '@prisma/client';

@WebSocketGateway({
  cors: '*',
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @WebSocketServer() server: Server;
  private user: any;
  private socketMap = new Map<string, any>();

  private clientsMap = {};
  addClientToMap(userId: string, client: Socket) {
    if (!this.clientsMap[userId]) {
      // client.join(this.user.username);
      this.clientsMap[userId] = new Set();
    }
    this.clientsMap[userId].add(client);
  }

  deleteClientFromMap(clientId: string) {
    Object.entries(this.clientsMap).forEach(
      ([userId, clientSet]: [string, Set<Socket>]) => {
        for (const client of clientSet) {
          if (client.id === clientId) {
            clientSet.delete(client);
            break;
          }
        }
        if (clientSet.size === 0) {
          delete this.clientsMap[userId];
        }
      },
    );
  }

  async afterInit(client: Socket) {
    client.use(async (req: any, next) => {
      try {
        const token =
          req.handshake.auth.jwt_token ?? req.handshake.headers.jwt_token;
        if (!token) {
          throw new WsException('Unauthorized: Token Not Provided');
        }
        // console.log(token);
        const payload = await validateToken(token, this.jwt);
        this.user = await this.prisma.user.findUnique({
          where: { id: payload?.sub || '' },
          select: {
            id: true,
            username: true,
            receivedNotifications: true,
          },
        });
        if (!payload || !this.user) {
          throw new WsException('Unauthorized: User Not Found');
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  }

  handleConnection(client: Socket) {
    this.addClientToMap(this.user.id, client);
  }

  handleNotificationEvent(
    type: NotificationType,
    receiverId: string,
    resource: any,
  ) {
    if (this.clientsMap[receiverId]) {
      for (const client of this.clientsMap[receiverId]) {
        client.emit(type, {
          data: resource,
        });
      }
    }
  }

  handleAcceptEvent(senderId: string, receiverId: string, gameId: string) {
    if (this.clientsMap[senderId]) {
      for (const client of this.clientsMap[senderId]) {
        client.emit('AcceptGame', {
          url: `/game/friend/${gameId}`,
        });
      }
    }
    if (this.clientsMap[receiverId]) {
      for (const client of this.clientsMap[receiverId]) {
        client.emit('AcceptGame', {
          url: `/game/friend/${gameId}`,
        });
      }
    }
  }

  handleDeclineEvent(senderId: string, receiverId: string) {
    const senderSocket = this.socketMap.get(senderId);
    if (senderSocket) {
      this.server.to(senderSocket.id).emit('DeclineGame', {
        message: 'Game request declined',
      });
    }
    const receiverSocket = this.socketMap.get(receiverId);
    if (receiverSocket) {
      this.server.to(receiverSocket.id).emit('DeclineGame', {
        message: 'Game request declined',
      });
    }
  }

  handleDisconnect(client: any) {
    this.deleteClientFromMap(client.id);
    const playeId = client.handshake.auth.token;
    if (playeId) {
      if (this.socketMap.has(playeId)) {
        this.socketMap.delete(playeId);
      }
    }
  }
}
