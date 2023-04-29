import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SendSocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendToAll(serverToClientId: string, message: any, excludeClientId?: string): void {
    this.server.emit(serverToClientId, message);
  }

  send(serverToClientId: string, clientId: string, message: any): void {
    this.server.to(clientId).emit(serverToClientId, message);
  }
}