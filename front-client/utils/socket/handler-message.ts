import { Socket } from 'socket.io-client';
import { ServerToClientId } from './socket.enums';
import { HandlerContextEventId } from '../socketToContext/event.enums';
import { EventSend } from '../socketToContext/event-send';

export const handleConnectedList = (
  client: Socket,
  data: any
) => {
  const message = new EventSend();
  message.sendToHandler(HandlerContextEventId.UPDATE_USERS, data);
  console.log("data")
};

// ... ajoutez des fonctions pour les autres types de messages

export const messageHandlers: {
  [key: string]: (client: Socket, data: any) => void;
} = {
  [ServerToClientId.CONNECTED_USERS_LIST]: handleConnectedList,
  // ... ajoutez les autres fonctions ici
};
