import { Socket } from 'socket.io';
import { ClientToServerId, ServerToClientId } from '../socket.enums';
import { SendSocketGateway } from '../send-socket';

export const handleConnected = (client: Socket, data: any, sendSocketGateway: SendSocketGateway) => {
    // Récupérer la liste des utilisateurs connectés

    const connectedUsers = Array.from(client.nsp.sockets.values())
        .map((socket: Socket) => ({ id: socket.id, username: (socket.data as any).username }));


    // Envoyer la liste des utilisateurs connectés au client

    console.log(connectedUsers);
    sendSocketGateway.sendToAll(ServerToClientId.CONNECTED_USERS_LIST, connectedUsers);
};

// ... ajout des fonctions pour les autres types de messages

export const messageHandlers: { [key: string]: (client: Socket, data?: any, sendSocketGateway?: SendSocketGateway) => void } = {
    [ClientToServerId.GET_CONNECTED_USERS]: handleConnected,
    // ... ajout les autres fonctions ici
};
