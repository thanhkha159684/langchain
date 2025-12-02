'use client';

import { Layout } from 'antd';
import { ChatProvider } from '@/contexts/ChatContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const { Content } = Layout;

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ChatProvider>
        <Layout style={{ minHeight: '100vh' }}>
          <Content>{children}</Content>
        </Layout>
      </ChatProvider>
    </ProtectedRoute>
  );
}
