import { useEffect, useRef } from 'react';
import { Session, BackendResponse } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatContainerProps {
  session: Session | null;
  loading: boolean;
  error: string | null;
  maxTurns: number;
  onSendMessage: (message: string) => Promise<BackendResponse | null>;
  onReset: () => void;
}

export function ChatContainer({
  session,
  loading,
  error,
  maxTurns,
  onSendMessage,
  onReset,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fallbackMessage = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-full dark-bg-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">AI Copilot</h1>
          <p className="text-secondary mb-8">Empieza una nueva conversacion</p>
          <button
            onClick={() => {
              onReset();
              window.location.reload();
            }}
            className="px-8 py-3 bg-accent-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            Nueva sesion
          </button>
        </div>
      </div>
    );
  }

  const isSessionLimited = session.turn_count >= maxTurns;
  const turnPercentage = (session.turn_count / maxTurns) * 100;

  const handleSend = async (message: string) => {
    fallbackMessage.current = null;
    const response = await onSendMessage(message);
    
    // Manejar la respuesta de fallback correctamente
    if (response?.fallback) {
      // Usar la propiedad correcta - podría ser 'content', 'text', o similar
      // Basado en el uso en ChatMessage, parece que debería ser 'content'
      fallbackMessage.current = 
        response.content || 
        response.text || 
        "Se ha producido un fallback, pero no hay mensaje disponible";
    }
  };

  return (
    <div className="flex flex-col h-full dark-bg-secondary">
      <div className="border-b border-dark px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-primary">AI Copilot</h1>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm text-secondary dark-bg-tertiary rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Reiniciar
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 dark-bg-tertiary rounded-full h-2">
            <div
              className="bg-accent-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${turnPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-secondary whitespace-nowrap">
            Turno {session.turn_count} de {maxTurns}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {session.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-secondary">
            <p>Comienza la conversacion escribiendo un mensaje</p>
          </div>
        ) : (
          <>
            {session.messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="dark-bg-tertiary rounded-bl-none rounded-xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {isSessionLimited && (
        <div className="border-t border-dark px-6 py-4 dark-bg-tertiary bg-opacity-50">
          <p className="text-accent-secondary text-sm font-medium">
            Hemos alcanzado el limite para esta sesion (20 turnos). Inicia una nueva para seguir conversando.
          </p>
        </div>
      )}

      {fallbackMessage.current && (
        <div className="border-t border-dark px-6 py-4 dark-bg-tertiary bg-opacity-50">
          <p className="text-accent-secondary text-sm">{fallbackMessage.current}</p>
        </div>
      )}

      {error && (
        <div className="border-t border-dark px-6 py-4 bg-red-900 bg-opacity-20">
          <p className="text-red-400 text-sm">Error: {error}</p>
        </div>
      )}

      <div className="border-t border-dark px-6 py-4">
        <ChatInput
          onSend={handleSend}
          disabled={isSessionLimited}
          loading={loading}
        />
      </div>
    </div>
  );
}