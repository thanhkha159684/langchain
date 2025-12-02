/**
 * Chat-related TypeScript types and interfaces
 */

export interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  session_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: Message[];
}

export interface ChatSessionList {
  sessions: ChatSession[];
  total: number;
  limit: number;
  offset: number;
}

export interface MessageCreate {
  content: string;
}

export interface ChatSessionCreate {
  title?: string;
}

export interface ChatMessagePair {
  user_message: Message;
  assistant_message: Message;
}
