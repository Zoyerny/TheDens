import { Socket } from 'socket.io-client';
import { ServerToClientId } from './socket.enums';

export const handleConnectedList = (client: Socket, data: any) => {
    const onlineUsersString = data.onlineUsers
        .map(
            (user: any) =>
                `ID: ${user.id}, SocketID: ${user.socketId}, Username: ${user.username}, Email: ${user.email}, ConnectedAt: ${user.connectedAt}`
        )
        .join("\n");

    const offlineUsersString = data.offlineUsers
        .map(
            (user: any) =>
                `ID: ${user.id}, Username: ${user.username}, Email: ${user.email}`
        )
        .join("\n");

    console.log(
        `Client ${client.id} received connected users list: \n${onlineUsersString} \n${offlineUsersString}`
    );
};

// ... ajoutez des fonctions pour les autres types de messages

export const messageHandlers: { [key: string]: (client: Socket, data: any) => void } = {
    [ServerToClientId.CONNECTED_USERS_LIST]: handleConnectedList,
    // ... ajoutez les autres fonctions ici
};
