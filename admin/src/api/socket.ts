import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const createSocket = (token: string): Socket => {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
};
