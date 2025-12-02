'use client';

import { Layout, Button, Typography, Avatar, Tooltip, Switch } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import SessionList from '@/components/SessionList';

const { Content, Header } = Layout;
const { Text } = Typography;

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header 
        style={{
          background: isDark ? '#141414' : '#ffffff',
          padding: '0 24px',
          borderBottom: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        <Text 
          strong 
          style={{ 
            fontSize: '18px',
            color: isDark ? 'rgba(255, 255, 255, 0.85)' : '#262626'
          }}
        >
          LangChain Chatbot
        </Text>

        {/* Right side - User menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isDark ? (
              <BulbFilled style={{ fontSize: '16px', color: '#faad14' }} />
            ) : (
              <BulbOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
            )}
            <Switch
              checked={isDark}
              onChange={toggleTheme}
              size="small"
            />
          </div>

          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              icon={<UserOutlined />} 
              style={{ background: '#1890ff' }}
            />
            <Text style={{ fontSize: '14px' }}>
              {user?.username || 'User'}
            </Text>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="Profile">
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => router.push('/profile')}
              />
            </Tooltip>
            <Tooltip title="Settings">
              <Button
                type="text"
                icon={<SettingOutlined />}
              />
            </Tooltip>
            <Tooltip title="Logout">
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                danger
              />
            </Tooltip>
          </div>
        </div>
      </Header>

      {/* Main Layout with Sidebar */}
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <SessionList />
        
        {/* Chat Content Area */}
        <Content
          style={{
            background: isDark ? '#141414' : '#ffffff',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
