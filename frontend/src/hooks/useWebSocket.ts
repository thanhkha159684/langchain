/**
 * React hook for WebSocket real-time chat streaming
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient, WebSocketMessage, WebSocketStatus } from '@/lib/websocket';
import type { Message } from '@/types/chat.types';

interface UseWebSocketOptions {
  sessionId: number;
  enabled?: boolean;
  onMessageReceived?: (message: Message) => void;
}

interface UseWebSocketReturn {
  sendMessage: (content: string) => void;
  isConnected: boolean;
  status: WebSocketStatus;
  streamingMessage: string | null;
  isStreaming: boolean;
  error: string | null;
}

export function useWebSocket({
  sessionId,
  enabled = true,
  onMessageReceived
}: UseWebSocketOptions): UseWebSocketReturn {
  const wsRef = useRef<WebSocketClient | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'chunk':
        setIsStreaming(true);
        setStreamingMessage(prev => (prev || '') + (message.content || ''));
        break;

      case 'done':
        setIsStreaming(false);
        if (message.message && onMessageReceived) {
          onMessageReceived(message.message as Message);
        }
        setStreamingMessage(null);
        break;

      case 'user_message':
        if (message.message && onMessageReceived) {
          onMessageReceived(message.message as Message);
        }
        break;

      case 'error':
        setIsStreaming(false);
        setStreamingMessage(null);
        setError(message.message || message.content || 'An error occurred');
        console.error('WebSocket error:', {
          message: message.message,
          content: message.content,
          code: message.code,
          full: message
        });
        break;

      default:
        console.warn('Unknown message type:', message);
    }
  }, [onMessageReceived]);

  const handleStatusChange = useCallback((newStatus: WebSocketStatus) => {
    setStatus(newStatus);
    
    if (newStatus === 'error') {
      setError('Connection error');
    } else if (newStatus === 'connected') {
      setError(null);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      setError('Authentication required');
      return;
    }

    // Create WebSocket client
    const ws = new WebSocketClient(sessionId, token, {
      onMessage: handleMessage,
      onStatusChange: handleStatusChange,
      onError: (error) => {
        console.error('WebSocket error event:', error);
        setError('Connection error');
      }
    });

    wsRef.current = ws;
    ws.connect();

    // Cleanup on unmount
    return () => {
      ws.disconnect();
      wsRef.current = null;
    };
  }, [sessionId, enabled, handleMessage, handleStatusChange]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current?.isConnected) {
      throw new Error('WebSocket is not connected');
    }

    try {
      wsRef.current.sendMessage(content);
      setError(null);
    } catch (err) {
      setError('Failed to send message');
      throw err;
    }
  }, []);

  return {
    sendMessage,
    isConnected: status === 'connected',
    status,
    streamingMessage,
    isStreaming,
    error
  };
}
