import { Socket } from 'socket.io-client';
import { messageHandlers } from './handler-message';
import { EventSend } from "../socketToContext/event-send";
import { SocketContextEventId, HandlerContextEventId } from '../socketToContext/event.enums';

// Création d'une classe HandlerSocket
export class HandlerSocket {
  private socket: Socket;
  private eventSender: EventSend;

  constructor(socket: Socket) {
    this.socket = socket;
    this.eventSender = new EventSend();
    this.setupHandlers();
  }

  updateSocket(newSocket: Socket) {
    this.socket = newSocket;
  }

  // Configuration des gestionnaires d'événements pour les connexions, les déconnexions et les messages
  private setupHandlers() {
    console.log("INITIALISATIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
    // Gestionnaire d'événement pour la connexion
    
    this.socket.on('connect', () => {
      console.log('Connected to the server');
      this.eventSender.sendToSocket(SocketContextEventId.SET_ISCONNECTED, true);
    });

    this.socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });

    // Gestionnaire d'événement pour la déconnexion
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
      //this.eventSender.sendToSocket(SocketContextEventId.SET_ISCONNECTED, false);
      this.eventSender.sendToHandler(HandlerContextEventId.RESET);
    });

    // Gestionnaire d'événement pour les messages
    Object.entries(messageHandlers).forEach(([messageType, handler]) => {
      this.socket.on(messageType, (data) => {
        this.eventSender.sendToHandler(HandlerContextEventId.SET_LOADING, true);

        handler(this.socket, data);

        this.eventSender.sendToHandler(HandlerContextEventId.SET_LOADING, false);
      });
    });
  }
}
