"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Spin, message as antMessage, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { Message } from "@/types/chat.types";
import { sendMessage } from "@/services/chat.service";
import MessageBubble from "./MessageBubble";

const { TextArea } = Input;
const { Text } = Typography;

interface ChatInterfaceProps {
  sessionId: number;
  initialMessages?: Message[];
  onMessageSent?: (userMessage: Message, aiMessage: Message) => void;
}

export default function ChatInterface({
  sessionId,
  initialMessages = [],
  onMessageSent,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update messages when initialMessages changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const content = inputValue.trim();

    // Validate message length
    if (content.length > 10000) {
      antMessage.error("Message exceeds maximum length of 10,000 characters");
      return;
    }

    try {
      setIsLoading(true);

      // Optimistic update - add user message immediately
      const tempUserMessage: Message = {
        id: Date.now(), // Temporary ID
        session_id: sessionId,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMessage]);
      setInputValue("");

      // Send message to API
      const response = await sendMessage(sessionId, content);

      // Replace temp message with real messages
      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMessage.id);
        return [
          ...withoutTemp,
          response.user_message,
          response.assistant_message,
        ];
      });

      // Notify parent component
      if (onMessageSent) {
        onMessageSent(response.user_message, response.assistant_message);
      }
    } catch (error: any) {
      // Remove optimistic message on error
      setMessages((prev) => prev.slice(0, -1));
      setInputValue(content); // Restore input for retry

      const errorMessage =
        error.response?.data?.detail?.message ||
        "Failed to send message. Please try again.";
      antMessage.error(errorMessage);
    } finally {
      setIsLoading(false);
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Text>Start a conversation...</Text>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
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
        <div className="flex gap-2">
          <div className="flex-1">
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={isLoading}
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
            loading={isLoading}
            disabled={!inputValue.trim()}
            size="large"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
