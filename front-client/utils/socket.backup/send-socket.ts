import { Socket } from "socket.io-client";
import { ClientToServerId } from "./socket.enums";
import { EventSend } from "../socketToContext/event-send";
import { AuthContextEventId } from "../socketToContext/event.enums";
import { useAuth } from "../contexts/auth-context";

export class SendSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  testRefreshToken() {
    const message = new EventSend();
    message.sendToAuth(AuthContextEventId.CHECK_TOKEN_STATUS);
  }

  async send(clientToServerId: ClientToServerId, data?: any) {
    console.log("ENVOIE DE LA DONNE DANS LE SEND");
    try {
      await this.waitForConnection();
      console.log("DONNER SANS ERREUR ENVOIE AU SERVEUR !");
      const payload = {
        type: clientToServerId,
        data: data,
      };
      const test = this.socket.emit("messageToServer", payload);
      console.log(test);
    } catch (error) {
      const message = new EventSend();
      message.sendToAuth(AuthContextEventId.CHECK_TOKEN_STATUS, {
        clientToServerId: clientToServerId,
        message: data,
      });
    }
  }

  waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        resolve();
      } else {
        this.socket.on("connect", () => {
          resolve();
        });
      }
    });
  }
}
