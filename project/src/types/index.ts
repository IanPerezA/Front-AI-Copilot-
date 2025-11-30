export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;

  // Nuevo contenedor unificado
  metadata?: {
    intent?: string;
    model?: string;
    provider?: string;
    latency_ms?: number;
    fallback?: boolean;
  };
}

export interface Session {
  id: string;
  messages: Message[];
  turn_count: number;
  created_at: number;
  updated_at: number;
}

export interface BackendResponse {
  response: string;
  intent: string;
  session_id: string;
  provider: string;
  model: string;
  tokens_in?: number;
  tokens_out?: number;
  latency?: number;
  fallback?: boolean;
  content?: string; // Posible propiedad correcta
  message?: string;
  text?: string;
}
