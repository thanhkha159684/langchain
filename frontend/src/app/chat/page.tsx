'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useChatContext } from '@/contexts/ChatContext';

export default function ChatPage() {
  const router = useRouter();
  const { sessions, isLoading, createSession } = useChatContext();

  useEffect(() => {
    const initializeChat = async () => {
      if (!isLoading) {
        if (sessions.length > 0 && sessions[0]) {
          // Redirect to most recent session
          router.replace(`/chat/${sessions[0].id}`);
        } else {
          // Create new session and redirect
          const newSession = await createSession('New Conversation');
          router.replace(`/chat/${newSession.id}`);
        }
      }
    };

    initializeChat();
  }, [sessions, isLoading]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' 
    }}>
      <Spin size="large" tip="Initializing chat..." />
    </div>
  );
}
