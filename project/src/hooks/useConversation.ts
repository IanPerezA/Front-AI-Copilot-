import { useState, useCallback } from 'react';
import { Message, Session, BackendResponse } from '../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';
const MAX_TURNS = 20;

export function useConversation() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(() => {
    const sessionId = crypto.randomUUID();
    const newSession: Session = {
      id: sessionId,
      messages: [],
      turn_count: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
    setSession(newSession);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (userMessage: string): Promise<BackendResponse | null> => {
      if (!session || loading) return null;

      setLoading(true);
      setError(null);

      const newTurn = session.turn_count + 1;
      if (newTurn > MAX_TURNS) {
        setLoading(false);
        return null;
      }

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessage,
        timestamp: Date.now(),
      };

      const updatedMessages = [...session.messages, userMsg];
      const updatedSession = {
        ...session,
        messages: updatedMessages,
        turn_count: newTurn,
        updated_at: Date.now(),
      };

      try {
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_input: userMessage,
            session_id: session.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const data: BackendResponse = await response.json();

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.response,
          timestamp: Date.now(),
          metadata: {
            intent: data.intent || "default",
            provider: data.provider,
            model: data.model,
            latency_ms: data.latency,
            fallback: data.fallback,
          },
        };

        const finalMessages = [...updatedMessages, assistantMsg];

        setSession({
          ...updatedSession,
          messages: finalMessages,
        });

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setSession(updatedSession);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session, loading]
  );

  const resetSession = useCallback(() => {
    setSession(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    session,
    loading,
    error,
    initSession,
    sendMessage,
    resetSession,
    maxTurns: MAX_TURNS,
  };
}
