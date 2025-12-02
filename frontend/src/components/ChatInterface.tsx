"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, Typography, Tag } from "antd";
import { SendOutlined, WifiOutlined, DisconnectOutlined } from "@ant-design/icons";
import type { ChatSessionWithMessages, Message } from "@/types/chat.types";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useMessage } from "@/hooks/useMessage";
import MessageBubble from "./MessageBubble";

const { TextArea } = Input;
const { Text, Title, Paragraph } = Typography;

interface ChatInterfaceProps {
  session: ChatSessionWithMessages;
  onSendMessage: (content: string) => Promise<void>;
}

export default function ChatInterface({
  session,
  onSendMessage,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoadingHTTP, setIsLoadingHTTP] = useState(false);
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { message } = useMessage();

  // WebSocket hook
  const {
    sendMessage: sendMessageWS,
    isConnected,
    status,
    streamingMessage,
    isStreaming,
    error: wsError
  } = useWebSocket({
    sessionId: session.id,
    enabled: true,
    onMessageReceived: (message) => {
      setMessages(prev => [...prev, message]);
    }
  });

  // Update messages when session changes
  useEffect(() => {
    setMessages(session.messages);
  }, [session.messages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming || isLoadingHTTP) return;

    const content = inputValue.trim();

    // Validate message length
    if (content.length > 10000) {
      message.error("Message exceeds maximum length of 10,000 characters");
      return;
    }

    setInputValue("");

    try {
      if (isConnected) {
        // Use WebSocket for streaming
        sendMessageWS(content);
      } else {
        // Fallback to HTTP
        setIsLoadingHTTP(true);
        await onSendMessage(content);
      }
    } catch (error: any) {
      // Restore input on error
      setInputValue(content);
      
      const errorMessage =
        error.response?.data?.detail?.message ||
        error.message ||
        "Failed to send message. Please try again.";
      message.error(errorMessage);
    } finally {
      setIsLoadingHTTP(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with connection status */}
      <div className="border-b p-3 bg-white flex justify-between items-center">
        <div>
          <Text strong>{session.title}</Text>
        </div>
        <div>
          {status === 'connected' && (
            <Tag icon={<WifiOutlined />} color="success">Real-time</Tag>
          )}
          {status === 'connecting' && (
            <Tag icon={<Spin size="small" />} color="processing">Connecting...</Tag>
          )}
          {status === 'disconnected' && (
            <Tag icon={<DisconnectOutlined />} color="default">HTTP Mode</Tag>
          )}
          {status === 'error' && (
            <Tag icon={<DisconnectOutlined />} color="error">Connection Error</Tag>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>
              <Text>Start a conversation...</Text>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {/* Streaming message */}
            {isStreaming && streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-3xl bg-gray-100 rounded-lg p-4">
                  <div className="prose prose-sm max-w-none">
                    {streamingMessage}
                    <span className="inline-block w-1 h-4 bg-blue-500 animate-pulse ml-1"></span>
                  </div>
                </div>
              </div>
            )}
            
            {isLoadingHTTP && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg p-3">
                  <Spin size="small" />
                  <Text className="ml-2 text-gray-600">AI is thinking...</Text>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-white">
        {wsError && (
          <div className="mb-2 text-xs text-red-500">
            {wsError} - Using HTTP fallback
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isStreaming || isLoadingHTTP}
              maxLength={10000}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">
              {inputValue.length} / 10000
            </div>
          </div>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={isLoadingHTTP}
            disabled={!inputValue.trim() || isStreaming || isLoadingHTTP}
            size="large"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
