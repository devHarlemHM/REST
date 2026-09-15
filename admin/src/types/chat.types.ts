export interface Chat {
  id: number;
  estudiante_id: number;
  psicologo_id: number | null;
  iniciado_en: string;
  ultima_actividad: string;
  finalizado_en: string | null;
  is_active: boolean;
  isSendByAi: boolean;
}

export interface Mensaje {
  id: number;
  chat_id: number;
  usuario_id: number | null;
  mensaje: string;
  enviado_en: string;
}

export interface ChatMessage {
  chatId: number;
  mensaje: string;
}

export interface SocketMessage {
  id: number;
  chatId: number;
  userId: number;
  mensaje: string;
  enviado_en: string;
}
