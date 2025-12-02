'use client';

import { Card, Typography, Descriptions, Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title } = Typography;

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <Title level={2} className="!mb-0">
              <UserOutlined className="mr-2" />
              User Profile
            </Title>
            <Space>
              <Button
                icon={<HomeOutlined />}
                onClick={() => router.push('/')}
              >
                Home
              </Button>
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Space>
          </div>

          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="User ID">
              {user.id}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Account Status">
              <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Member Since">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6">
            <Title level={4}>Quick Actions</Title>
            <Space>
              <Button type="primary" onClick={() => router.push('/chat')}>
                Go to Chat
              </Button>
              <Button onClick={() => router.push('/settings')}>
                Settings
              </Button>
            </Space>
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
