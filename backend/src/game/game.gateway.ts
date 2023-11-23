import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { GameType } from '@prisma/client';

@WebSocketGateway({
	cors: '*',
	namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	gameQueue: any[] = [];
	mapPlayers: Map<string, any> = new Map();
	canvasWidth = 1080;
	canvasHeight = 720;
	mapSocketToPlayer: Map<string, Socket> = new Map();
	@WebSocketServer() server: Server;
	constructor(
		private readonly GameRoom: GameService,
		private readonly prisma: PrismaService,
	) {
		// this.startInterval();
	}

	handleConnection(client: Socket, ...args: any[]) {
		const playeId: string = client.handshake.auth.token;
		if (playeId) {
			this.mapSocketToPlayer.set(playeId, client);
		}
	}

	@SubscribeMessage('RandomMatch')
	async createRandomMatch(socket: Socket, ...args: any[]): Promise<void> {
		try {
			const playeId: string = socket.handshake.auth.token;
			const ObjectPlayer = {
				id: playeId,
				socket: this.mapSocketToPlayer.get(playeId),
				x: 10,
				y: this.canvasHeight / 2 - 50,
				score: 0,
				width: 20,
				height: 200,
			};
			if (!this.gameQueue.some(player => player.id === ObjectPlayer.id)) {
				this.gameQueue.push(ObjectPlayer);
				// console.log(this.gameQueue);
			}
			if (this.gameQueue.length >= 2) {
				// console.log(' before', this.gameQueue);
				const player = this.gameQueue.shift(); // player 1
				// console.log(player.id);
				const opponent = this.gameQueue.shift(); // player 2
				// console.log(opponent.id);
				// console.log(' after', this.gameQueue);
				// console.log('len', this.gameQueue.length);
				opponent.x = this.canvasWidth - 30;
				const room = this.GameRoom.createRoom();
				const match = await this.prisma.game.create({
					data: {
						id: room,
						Player: {
							connect: { id: player.id },
						},
						Opponent: {
							connect: { id: opponent.id },
						},
						playerScore: player.score,
						opponentScore: opponent.score,
						type: GameType.RandomMatch,
					},
				});
				player.socket.join(room);
				opponent.socket.join(room);
				this.mapPlayers.set(player.id, player);
				this.mapPlayers.set(opponent.id, opponent);
				this.server.to(room).emit('RandomMatch', {
					player: player.id, opponent: opponent.id,
					playerY: player.y, opponentY: opponent.y,
					room: room,
				});
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	@SubscribeMessage('move')
	movePaddle(socket: Socket, payload: any): void {
		console.log(payload);
		if (this.mapPlayers.has(payload.player)) {
			const player = this.mapPlayers.get(payload.player);
			if (payload.direction === 'up') {
				player.y -= 7;
			}
			else if (payload.direction === 'down') {
				player.y += 7;
			}
			this.server.to(payload.room).emit('PlayerMoved', { player: player.id, y: player.y });
		}
	}


	// moveBall(): void {

	// }

	// startInterval() {
	// 	setInterval(() => {

	// 	}, 10);
	// }

	handleDisconnect(socket: Socket): void {
		const playeId: string = socket.handshake.auth.token;
		if (playeId) {
			this.mapSocketToPlayer.delete(playeId);
			this.gameQueue = this.gameQueue.filter(player => player.id !== playeId);

			console.log('Player disconnected: ', socket.id);
		}
	}

}