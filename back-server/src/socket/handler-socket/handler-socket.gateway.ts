import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { messageHandlers } from './handler-message';
import { verify, JwtPayload } from 'jsonwebtoken';
import { Inject } from '@nestjs/common';
import { SendSocketGateway } from '../send-socket';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authorization'],
    credentials: true
  },
})
export class HandlerSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  constructor(
    @Inject(SendSocketGateway) private readonly sendSocketGateway: SendSocketGateway,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    let token = client.handshake.query.token;
    if (Array.isArray(token)) {
      token = token[0];
    }
    try {
      const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
      // Stockez les informations décodées dans les données du client si nécessaire
      client.data = { ...client.data, ...decoded };
    } catch (error) {
      console.log('Token verification error:', error);
      console.log('Invalid token, disconnecting client');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: { type: string; data: any }): void {
    console.log("message recu :", payload.type);

    const handler = messageHandlers[payload.type];
    if (handler) {
      handler(client, payload.data, this.sendSocketGateway);
    } else {
      console.log(`Unhandled message type: ${payload.type}`);
    }
  }
}
