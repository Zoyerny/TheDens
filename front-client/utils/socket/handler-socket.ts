import { Socket } from 'socket.io-client';
import { messageHandlers } from './handler-message';
import { ServerToClientId } from './socket.enums';

// Création d'une classe HandlerSocket
export class HandlerSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.setupHandlers();
  }

  // Configuration des gestionnaires d'événements pour les connexions, les déconnexions et les messages
  private setupHandlers() {
    // Gestionnaire d'événement pour la connexion
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Gestionnaire d'événement pour la déconnexion
    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    // Gestionnaire d'événement pour les messages
    Object.entries(messageHandlers).forEach(([messageType, handler]) => {
      this.socket.on(messageType, (data) => {
        handler(this.socket, data);
      });
    });
  }
}
