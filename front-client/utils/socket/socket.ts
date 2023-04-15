// socket.js
import { io } from 'socket.io-client';

export const createSocketConnection = (token: string | null) => {
  if (!token) {
    throw new Error('Token is required to create a socket connection.');
  }

  const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL!, {
    query: { token: token },
  });

  return socket;
};
