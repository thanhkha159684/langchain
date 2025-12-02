'use client';

import { Card, Typography, Button, Avatar, Divider } from 'antd';
import { ArrowLeftOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Text } = Typography;

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBack = () => {
    router.push('/chat');
  };

  if (!user) return null;

  // Get user initials for avatar
  const getInitials = (username: string) => {
    return username
      .split('_')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex items-center justify-between">
          <Title level={3} className="!mb-0 !text-gray-800">
            My Profile
          </Title>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="rounded-md"
          >
            Back
          </Button>
        </div>
      </header>

      {/* Profile Card - Centered */}
      <div className="flex items-center justify-center py-16 px-4">
        <Card 
          className="w-full max-w-2xl shadow-sm"
          styles={{ body: { padding: '48px' } }}
        >
          {/* Avatar Section */}
          <div className="flex justify-center mb-8">
            <Avatar
              size={120}
              className="bg-white border-2 border-gray-300"
              style={{ 
                fontSize: '48px',
                color: '#424242',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getInitials(user.username)}
            </Avatar>
          </div>

          {/* Username Section */}
          <div className="mb-8">
            <Text type="secondary" className="block mb-2 text-sm">
              Username
            </Text>
            <Text strong className="text-xl block">
              {user.username}
            </Text>
          </div>

          <Divider className="my-8" />

          {/* Email Section */}
          <div className="mb-8">
            <Text type="secondary" className="block mb-2 text-sm">
              Email
            </Text>
            <Text strong className="text-xl block">
              {user.email}
            </Text>
          </div>

          <Divider className="my-8" />

          {/* Member Since Section */}
          <div className="mb-12">
            <Text type="secondary" className="block mb-2 text-sm">
              Member since
            </Text>
            <Text strong className="text-xl block">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </div>

          <Divider className="my-8" />

          {/* Logout Button - Centered */}
          <div className="flex justify-center pt-4">
            <Button
              danger
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="px-12 rounded-md"
              style={{ 
                borderColor: '#ff4d4f',
                color: '#ff4d4f'
              }}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
