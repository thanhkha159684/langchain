'use client';

import { Card, Typography, Button, Space } from 'antd';
import { MessageOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Title, Paragraph } = Typography;

function ChatContent() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center">
            <MessageOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={2}>Welcome to Chat, {user?.username}!</Title>
            <Paragraph type="secondary" className="text-lg">
              Chat functionality will be implemented in Epic 3.
            </Paragraph>
            <Paragraph>
              For now, you can explore your profile or navigate to other pages.
            </Paragraph>

            <Space size="large" className="mt-6">
              <Button
                type="primary"
                size="large"
                icon={<UserOutlined />}
                onClick={() => router.push('/profile')}
              >
                View Profile
              </Button>
              <Button
                size="large"
                icon={<HomeOutlined />}
                onClick={() => router.push('/')}
              >
                Go Home
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}
