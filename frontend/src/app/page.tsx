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
    <div className="flex min-h-screen items-center justify-center bg-white">
      <main className="text-center p-8 max-w-4xl">
        <Title level={1} className="!mb-6">🤖 LangChain Chatbot!</Title>
        <Paragraph className="text-xl mb-12 text-gray-600">
          AI-powered chatbot with GPT-4 integration via LangChain
        </Paragraph>

        {isAuthenticated ? (
          <div className="mb-16">
            <Paragraph className="text-lg mb-8">
              Welcome back, <strong>{user?.username}</strong>!
            </Paragraph>
            <div className="flex gap-6 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<MessageOutlined />}
                onClick={() => router.push("/chat")}
                className="rounded-md h-12 px-8"
              >
                Go to Chat
              </Button>
              <Button
                size="large"
                icon={<UserOutlined />}
                onClick={() => router.push("/profile")}
                className="rounded-md h-12 px-8"
              >
                View Profile
              </Button>
            </div>
          </div>
        ) : (
          <div className="mb-16">
            <Paragraph className="text-lg mb-8 text-gray-600">
              Sign in or create an account to start chatting with AI
            </Paragraph>
            <div className="flex gap-6 justify-center">
              <Button
                type="primary"
                size="large"
                icon={<LoginOutlined />}
                onClick={() => router.push("/login")}
                className="rounded-md h-12 px-8"
              >
                Sign In
              </Button>
              <Button
                size="large"
                icon={<UserAddOutlined />}
                onClick={() => router.push("/register")}
                className="rounded-md h-12 px-8"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-gray-200">
          <Title level={3} className="!mb-10">Features</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">🔐 Secure Authentication</h3>
              <p className="text-sm text-gray-600 leading-relaxed">JWT-based authentication with secure password hashing</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">💬 AI Chat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Powered by GPT-4 via LangChain integration (Coming in Epic 3)</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">📝 Multi-Session</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Manage multiple chat conversations (Coming in Epic 4)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

