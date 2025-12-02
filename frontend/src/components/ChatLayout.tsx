'use client';

import { useState } from 'react';
import { Layout, Button, Typography, Input, Avatar, Tooltip, Switch } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SearchOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Mock session data - sẽ được thay thế bằng real data từ API
  const mockSessions = [
    { id: '1', title: 'How to use React hooks?', timestamp: '2 hours ago' },
    { id: '2', title: 'Python async programming', timestamp: 'Yesterday' },
    { id: '3', title: 'Docker best practices', timestamp: '2 days ago' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar - Session List */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        width={280}
        collapsedWidth={0}
        breakpoint="lg"
        style={{
          background: isDark ? '#1f1f1f' : '#f5f5f5',
          borderRight: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
        }}
      >
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          padding: collapsed ? 0 : '12px'
        }}>
          {/* New Chat Button */}
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => console.log('New chat')}
            style={{
              width: '100%',
              height: '48px',
              marginBottom: '16px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            New Chat
          </Button>

          {/* Search Sessions */}
          <Input
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            placeholder="Search conversations..."
            style={{
              marginBottom: '16px',
              borderRadius: '8px',
              height: '40px',
            }}
          />

          {/* Session List */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            marginBottom: '16px'
          }}>
            {mockSessions.map((session) => (
              <div
                key={session.id}
                style={{
                  padding: '12px 16px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: isDark ? '#262626' : '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark ? '#434343' : '#e6f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? '#262626' : '#ffffff';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}>
                  <MessageOutlined style={{ fontSize: '14px', color: '#8c8c8c' }} />
                  <Text 
                    style={{ 
                      fontSize: '14px',
                      fontWeight: 500,
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {session.title}
                  </Text>
                </div>
                <Text 
                  type="secondary" 
                  style={{ 
                    fontSize: '12px',
                    paddingLeft: '22px'
                  }}
                >
                  {session.timestamp}
                </Text>
              </div>
            ))}
          </div>

          {/* User Profile Section */}
          <div style={{
            padding: '12px',
            borderTop: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
            background: isDark ? '#262626' : '#ffffff',
            borderRadius: '8px',
          }}>
            {/* Theme Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              marginBottom: '12px',
              borderRadius: '6px',
              background: isDark ? '#1f1f1f' : '#fafafa',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isDark ? (
                  <BulbFilled style={{ fontSize: '16px', color: '#faad14' }} />
                ) : (
                  <BulbOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                )}
                <Text style={{ fontSize: '13px' }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </div>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                size="small"
              />
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ background: '#1890ff' }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Text strong style={{ fontSize: '14px', display: 'block' }}>
                  {user?.username || 'User'}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user?.email || 'user@example.com'}
                </Text>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Tooltip title="Profile">
                <Button
                  type="text"
                  icon={<UserOutlined />}
                  onClick={() => router.push('/profile')}
                  style={{ flex: 1 }}
                />
              </Tooltip>
              <Tooltip title="Settings">
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  style={{ flex: 1 }}
                />
              </Tooltip>
              <Tooltip title="Logout">
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  danger
                  style={{ flex: 1 }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </Sider>

      {/* Main Content Area */}
      <Layout>
        {/* Header với toggle button */}
        <Header 
          style={{
            background: isDark ? '#141414' : '#ffffff',
            padding: '0 24px',
            borderBottom: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
            display: 'flex',
            alignItems: 'center',
            height: '64px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              width: 48,
              height: 48,
            }}
          />
          <Text 
            strong 
            style={{ 
              fontSize: '18px',
              marginLeft: '16px',
              color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#262626'
            }}
          >
            LangChain Chatbot
          </Text>
        </Header>

        {/* Chat Content Area */}
        <Content
          style={{
            background: isDark ? '#141414' : '#ffffff',
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
