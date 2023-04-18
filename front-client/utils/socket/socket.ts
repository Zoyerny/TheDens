import { io } from 'socket.io-client';

export const createSocketConnection = (token: string | null,refreshToken: string | null, userId: string) => {
    if (!token) {
        throw new Error('Token is required to create a socket connection.');
    }

    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
        query: {
            token: token,
            refreshToken : refreshToken,
            userId: userId
        },
    });

    return socket;
};