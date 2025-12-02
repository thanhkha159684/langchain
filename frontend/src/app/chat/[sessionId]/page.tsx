'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Typography, Input, Button, Spin } from 'antd';
import { useMessage } from '@/hooks/useMessage';
import { SendOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatLayout from '@/components/ChatLayout';
import MessageBubble from '@/components/MessageBubble';
import { useChatContext } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { Message } from '@/types/chat.types';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function ChatSessionContent() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { message } = useMessage();
  const { currentSession, selectSession, isLoading: sessionLoading } = useChatContext();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket integration
  const { sendMessage: sendWsMessage, isConnected, streamingMessage, isStreaming } = useWebSocket({
    sessionId: currentSession?.id || 0,
    enabled: !!currentSession,
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Load session when sessionId changes
  useEffect(() => {
    if (sessionId && sessionId !== currentSession?.id.toString()) {
      selectSession(parseInt(sessionId));
    }
  }, [sessionId, currentSession?.id]);

  // Load messages when session changes
  useEffect(() => {
    if (currentSession) {
      setMessages(currentSession.messages || []);
    }
  }, [currentSession]);

  const handleSend = async () => {
    if (!inputValue.trim() || isStreaming || !currentSession) return;

    const content = inputValue.trim();
    
    if (content.length > 10000) {
      message.error('Message too long (max 10,000 characters)');
      return;
    }

    try {
      setInputValue('');
      
      // Send via WebSocket
      await sendWsMessage(content);
      
      // WebSocket will handle adding messages via onMessage callback
    } catch (error: any) {
      setInputValue(content);
      const errMsg = error.message || 'Failed to send message';
      message.error(errMsg);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
  };

  if (sessionLoading || !currentSession) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%' 
      }}>
        <Spin size="large" tip="Loading session..." />
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Messages Area or Welcome State */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.length === 0 ? (
            /* Welcome / Empty State */
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 24px',
            }}>
              <div style={{ maxWidth: '600px', textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '40px',
                }}>
                  🤖
                </div>
                <Title level={2} style={{ marginBottom: '16px', color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#262626' }}>
                  Xin chào, {user?.username}!
                </Title>
                <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
                  Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì - từ lập trình, 
                  giải thích khái niệm, đến debug code.
                </Paragraph>

                {/* Suggestion Chips */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginTop: '32px',
                }}>
                  {[
                    { icon: '💡', text: 'Giải thích React hooks' },
                    { icon: '🐛', text: 'Debug Python code' },
                    { icon: '🚀', text: 'Docker best practices' },
                    { icon: '📚', text: 'LangChain tutorial' },
                  ].map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      style={{
                        padding: '16px',
                        border: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: isDark ? '#262626' : '#fafafa',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? '#434343' : '#e6f4ff';
                        e.currentTarget.style.borderColor = '#1890ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDark ? '#262626' : '#fafafa';
                        e.currentTarget.style.borderColor = isDark ? '#434343' : '#e8e8e8';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                        {suggestion.icon}
                      </div>
                      <Text style={{ fontSize: '13px', color: isDark ? 'rgba(255, 255, 255, 0.65)' : '#595959' }}>
                        {suggestion.text}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages List */
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              
              {/* Streaming Message */}
              {isStreaming && streamingMessage && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    background: isDark ? '#262626' : '#f5f5f5',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    maxWidth: '80%',
                  }}>
                    <Text>{streamingMessage}<span style={{ animation: 'blink 1s infinite' }}>▊</span></Text>
                  </div>
                </div>
              )}
              
              {isStreaming && !streamingMessage && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    background: isDark ? '#262626' : '#f5f5f5',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Spin size="small" />
                    <Text type="secondary">AI đang suy nghĩ...</Text>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input Area - Gemini Style */}
        <div style={{
          padding: '24px',
          borderTop: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
          background: isDark ? '#141414' : '#ffffff',
        }}>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {/* Connection Status */}
            {!isConnected && (
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <Text type="warning" style={{ fontSize: '12px' }}>
                  ⚠️ Real-time connection unavailable - using HTTP mode
                </Text>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              gap: '12px',
              padding: '12px 16px',
              border: isDark ? '1px solid #434343' : '1px solid #d9d9d9',
              borderRadius: '24px',
              background: isDark ? '#262626' : '#ffffff',
              boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s',
            }}>
              <TextArea
                placeholder="Ask me anything..."
                autoSize={{ minRows: 1, maxRows: 6 }}
                variant="borderless"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isStreaming}
                maxLength={10000}
                style={{
                  flex: 1,
                  resize: 'none',
                  fontSize: '15px',
                }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                shape="circle"
                size="large"
                loading={isStreaming}
                disabled={!inputValue.trim() || isStreaming}
                onClick={handleSend}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </div>
            <Text 
              type="secondary" 
              style={{ 
                display: 'block',
                textAlign: 'center',
                fontSize: '12px',
                marginTop: '12px'
              }}
            >
              Press Enter to send, Shift + Enter for new line
            </Text>
          </div>
        </div>
      
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ChatSessionPage() {
  return (
    <ProtectedRoute>
      <ChatLayout>
        <ChatSessionContent />
      </ChatLayout>
    </ProtectedRoute>
  );
}
