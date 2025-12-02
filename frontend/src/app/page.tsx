"use client";

import { Button, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { MessageOutlined, LoginOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="text-center p-8 max-w-3xl">
        <Title level={1}>🤖 LangChain Chatbot</Title>
        <Paragraph className="text-xl mb-8 text-gray-700">
          AI-powered chatbot with GPT-4 integration via LangChains
        </Paragraph>

        {isAuthenticated ? (
          <div>
            <Paragraph className="text-lg mb-6">
              Welcome back, <strong>{user?.username}</strong>!
            </Paragraph>
            <div className="flex gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<MessageOutlined />}
                onClick={() => router.push("/chat")}
              >
                Go to Chat
              </Button>
              <Button
                size="large"
                icon={<UserOutlined />}
                onClick={() => router.push("/profile")}
              >
                View Profile
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <Paragraph className="text-lg mb-6">
              Sign in or create an account to start chatting with AI
            </Paragraph>
            <div className="flex gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
              <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => router.push("/register")}
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Title level={4}>Features</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-left">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">🔐 Secure Authentication</h3>
              <p className="text-sm text-gray-600">JWT-based authentication with secure password hashing</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">💬 AI Chat</h3>
              <p className="text-sm text-gray-600">Powered by GPT-4 via LangChain integration (Coming in Epic 3)</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">📝 Multi-Session</h3>
              <p className="text-sm text-gray-600">Manage multiple chat conversations (Coming in Epic 4)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

