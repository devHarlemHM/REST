import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useChatSocket } from '../../../hooks/useChatSocket';
import { chatApi } from '../../../api';
import { Card } from '../../../components/ui';
import { LoadingSpinner } from '../../../components/shared';
import type { Mensaje, SocketMessage } from '../../../types';

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const chatId = Number(searchParams.get('chatId'));
  const { token, user } = useAuth();

  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, onNewMessage, sendTyping } = useChatSocket(chatId, token || '');

  useEffect(() => {
    loadMensajes();
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = onNewMessage((msg: SocketMessage) => {
      setMensajes((prev) => [
        ...prev,
        {
          id: msg.id,
          chat_id: msg.chatId,
          usuario_id: msg.userId,
          mensaje: msg.mensaje,
          enviado_en: msg.enviado_en,
        },
      ]);
    });
    return unsubscribe;
  }, [onNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  async function loadMensajes() {
    try {
      const data = await chatApi.getMensajes(chatId);
      setMensajes(data);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;
    sendMessage(nuevoMensaje.trim());
    setNuevoMensaje('');
  }

  function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    setNuevoMensaje(e.target.value);
    sendTyping(e.target.value.length > 0);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-4 mb-4">
        <ArrowLeft size={24} className="text-text-secondary cursor-pointer" onClick={() => window.history.back()} />
        <h2 className="text-lg font-semibold text-text-primary">Chat con estudiante</h2>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden" padding="sm">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mensajes.map((msg) => {
            const isOwn = msg.usuario_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2 ${
                    isOwn
                      ? 'bg-primary text-white'
                      : 'bg-surface-elevated text-text-primary'
                  }`}
                >
                  <p className="text-sm">{msg.mensaje}</p>
                  <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-text-muted'}`}>
                    {new Date(msg.enviado_en).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleEnviar} className="flex items-center gap-2 p-3 border-t border-gray-100">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={handleTyping}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-lg border border-gray-200 bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={!nuevoMensaje.trim()}
            className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>
      </Card>
    </div>
  );
}
