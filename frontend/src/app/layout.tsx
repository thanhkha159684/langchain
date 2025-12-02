import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp } from "antd";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangChain Chatbot",
  description: "AI-powered chatbot with GPT-4 integration via LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AntdRegistry>
          <AntdApp>
            <ThemeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ThemeProvider>
          </AntdApp>
        </AntdRegistry>
      </body>
    </html>
  );
}
