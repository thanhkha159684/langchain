"use client";

import { Button, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="text-center p-8">
        <Title>LangChain Chatbot</Title>
        <Paragraph className="text-lg mb-6">
          Welcome to your AI-powered chatbot with GPT-4 integration via LangChain
        </Paragraph>
        <div className="flex gap-4 justify-center">
          <Button type="primary" size="large">
            Get Started
          </Button>
          <Button size="large">
            Learn More
          </Button>
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-600">
            This is a test page with Ant Design v5 and Tailwind CSS integration
          </p>
        </div>
      </main>
    </div>
  );
}
