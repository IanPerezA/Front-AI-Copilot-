import { useEffect } from 'react';
import { ChatContainer } from './components/ChatContainer';
import { useConversation } from './hooks/useConversation';

function App() {
  const { session, loading, error, initSession, sendMessage, resetSession, maxTurns } = useConversation();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return (
    <div className="flex h-screen dark-bg-primary">
      <div className="flex-1 flex flex-col">
        <ChatContainer
          session={session}
          loading={loading}
          error={error}
          maxTurns={maxTurns}
          onSendMessage={sendMessage}
          onReset={resetSession}
        />
      </div>
    </div>
  );
}

export default App;
