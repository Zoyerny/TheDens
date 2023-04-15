import { Socket } from 'socket.io-client';
import { ServerToClientId } from './socket.enums';

export const handleConnectedList = (client: Socket, data: any[]) => {
    console.log(`Client ${client.id} received connected users list:`);
    data.forEach((data) => {
        console.log(`User ID: ${data.id}, Username: ${data.username}`);
    });
};
// ... ajoutez des fonctions pour les autres types de messages

export const messageHandlers: { [key: string]: (client: Socket, data: any) => void } = {
    [ServerToClientId.CONNECTED_USERS_LIST]: handleConnectedList,
    // ... ajoutez les autres fonctions ici
};
