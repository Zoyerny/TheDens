import { Socket } from "socket.io-client";
import { ClientToServerId } from "./socket.enums";

export class SendSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  send(clientToServerId: ClientToServerId, data?: any): void {

    const payload = {
      type: clientToServerId,
      data: data
    };

    this.socket.emit('messageToServer', payload);
  }
}
