// socket.enums.ts (côté serveur)
export enum ClientToServerId {
    // ...
    GET_CONNECTED_USERS = 'getConnectedUsers',
}

// socket.enums.ts (côté client)
export enum ServerToClientId {
    // ...
    CONNECTED_USERS_LIST = 'connectedUsersList',
}