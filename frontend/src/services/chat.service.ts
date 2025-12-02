/**
 * Chat service for API interactions
 */

import apiClient from "@/lib/api-client";
import {
  ChatSession,
  ChatSessionCreate,
  ChatSessionList,
  ChatSessionWithMessages,
  MessageCreate,
  ChatMessagePair,
} from "@/types/chat.types";

/**
 * Create a new chat session
 */
export async function createSession(
  data: ChatSessionCreate = {}
): Promise<ChatSession> {
  const response = await apiClient.post<ChatSession>("/chat/sessions", data);
  return response.data;
}

/**
 * Get all chat sessions for current user
 */
export async function getSessions(
  limit: number = 20,
  offset: number = 0
): Promise<ChatSessionList> {
  const response = await apiClient.get<ChatSessionList>("/chat/sessions", {
    params: { limit, offset },
  });
  return response.data;
}

/**
 * Get a specific chat session with all messages
 */
export async function getSession(
  sessionId: number
): Promise<ChatSessionWithMessages> {
  const response = await apiClient.get<ChatSessionWithMessages>(
    `/chat/sessions/${sessionId}`
  );
  return response.data;
}

/**
 * Update a chat session title
 */
export async function updateSession(
  sessionId: number,
  title: string
): Promise<ChatSession> {
  const response = await apiClient.patch<ChatSession>(
    `/chat/sessions/${sessionId}`,
    { title }
  );
  return response.data;
}

/**
 * Delete a chat session
 */
export async function deleteSession(sessionId: number): Promise<void> {
  await apiClient.delete(`/chat/sessions/${sessionId}`);
}

/**
 * Send a message in a chat session and get AI response
 */
export async function sendMessage(
  sessionId: number,
  content: string
): Promise<ChatMessagePair> {
  const response = await apiClient.post<ChatMessagePair>(
    `/chat/sessions/${sessionId}/messages`,
    { content }
  );
  return response.data;
}

const chatService = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
  sendMessage,
};

export default chatService;
