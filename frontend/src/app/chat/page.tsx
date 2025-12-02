'use client';

import { Typography, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ProtectedRoute from '@/components/ProtectedRoute';
import ChatLayout from '@/components/ChatLayout';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function ChatContent() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Welcome / Empty State */}
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
              style={{
                flex: 1,
                resize: 'none',
                fontSize: '15px',
              }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  console.log('Send message');
                }
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              shape="circle"
              size="large"
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
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatLayout>
        <ChatContent />
      </ChatLayout>
    </ProtectedRoute>
  );
}
