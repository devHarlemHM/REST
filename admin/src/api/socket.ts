import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL;

if (!SOCKET_URL) {
  throw new Error('VITE_API_URL is required');
}

export const createSocket = (token: string): Socket => {
  return io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });
};
