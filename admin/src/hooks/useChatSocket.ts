import { useEffect, useCallback, useRef } from 'react';
import { createSocket } from '../api/socket';
import type { SocketMessage } from '../types';

export function useChatSocket(chatId: number | null, token: string) {
  const socketRef = useRef<ReturnType<typeof createSocket> | null>(null);
  const listenersRef = useRef<((msg: SocketMessage) => void)[]>([]);

  useEffect(() => {
    if (!chatId || !token) return;

    const socket = createSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_chat', chatId);
    });

    socket.on('new_message', (msg: SocketMessage) => {
      listenersRef.current.forEach((cb) => cb(msg));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [chatId, token]);

  const sendMessage = useCallback((mensaje: string) => {
    socketRef.current?.emit('chat_message', { chatId, mensaje });
  }, [chatId]);

  const onNewMessage = useCallback((callback: (msg: SocketMessage) => void) => {
    listenersRef.current.push(callback);
    return () => {
      listenersRef.current = listenersRef.current.filter((cb) => cb !== callback);
    };
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    socketRef.current?.emit('typing', { chatId, isTyping });
  }, [chatId]);

  return { sendMessage, onNewMessage, sendTyping };
}
