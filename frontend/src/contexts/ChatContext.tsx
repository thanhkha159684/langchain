'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import chatService from '@/services/chat.service';
import type { ChatSession, ChatSessionWithMessages, Message } from '@/types/chat.types';

interface ChatContextType {
  sessions: ChatSession[];
  currentSession: ChatSessionWithMessages | null;
  isLoading: boolean;
  loadSessions: () => Promise<void>;
  createSession: (title?: string) => Promise<ChatSession>;
  selectSession: (sessionId: number) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  updateSessionTitle: (sessionId: number, title: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (msg: Message) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSessionWithMessages | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load all sessions
  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getSessions(50, 0);
      setSessions(data.sessions);
    } catch (error) {
      console.error('Load sessions error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new session
  const createSession = async (title?: string): Promise<ChatSession> => {
    try {
      const newSession = await chatService.createSession({ title });
      setSessions(prev => [newSession, ...prev]);
      await selectSession(newSession.id);
      return newSession;
    } catch (error) {
      console.error('Create session error:', error);
      throw error;
    }
  };

  // Select and load a session with messages
  const selectSession = async (sessionId: number) => {
    try {
      setIsLoading(true);
      const sessionData = await chatService.getSession(sessionId);
      setCurrentSession(sessionData);
    } catch (error) {
      console.error('Select session error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete session
  const deleteSession = async (sessionId: number) => {
    try {
      await chatService.deleteSession(sessionId);
      
      // Remove from sessions list
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // If deleted session was current, switch to another or create new
      if (currentSession?.id === sessionId) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        if (remainingSessions.length > 0 && remainingSessions[0]) {
          await selectSession(remainingSessions[0].id);
        } else {
          await createSession('New Conversation');
        }
      }
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  };

  // Update session title
  const updateSessionTitle = async (sessionId: number, title: string) => {
    try {
      const updated = await chatService.updateSession(sessionId, title);
      
      // Update in sessions list
      setSessions(prev =>
        prev.map(s => (s.id === sessionId ? { ...s, title: updated.title } : s))
      );
      
      // Update current session if it's the one being updated
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title: updated.title } : null);
      }
    } catch (error) {
      console.error('Update title error:', error);
      throw error;
    }
  };

  // Send message
  const sendMessage = async (content: string) => {
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const { user_message, assistant_message } = await chatService.sendMessage(
        currentSession.id,
        content
      );

      // Add both messages to current session
      setCurrentSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, user_message, assistant_message]
        };
      });

      // Update session updated_at in list
      setSessions(prev =>
        prev.map(s =>
          s.id === currentSession.id
            ? { ...s, updated_at: new Date().toISOString() }
            : s
        )
      );

      // Re-sort sessions by updated_at
      setSessions(prev => [...prev].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ));
    } catch (error: any) {
      console.error('Send message error:', error);
      throw error;
    }
  };

  // Add message to current session (for optimistic updates)
  const addMessage = (msg: Message) => {
    setCurrentSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, msg]
      };
    });
  };

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        isLoading,
        loadSessions,
        createSession,
        selectSession,
        deleteSession,
        updateSessionTitle,
        sendMessage,
        addMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
