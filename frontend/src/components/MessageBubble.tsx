"use client";

import React, { useState } from "react";
import { Button, Typography } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMessage } from "@/hooks/useMessage";
import { Message } from "@/types/chat.types";

const { Text } = Typography;

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message: messageData }: MessageBubbleProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { message } = useMessage();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(`${index}`);
      message.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      message.error("Failed to copy code");
    }
  };

  const isUser = messageData.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <div className="prose prose-sm max-w-none">
          {isUser ? (
            // For user messages, just show plain text
            <div className="whitespace-pre-wrap break-words">
              {messageData.content}
            </div>
          ) : (
            // For AI messages, render markdown
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");
                  const codeIndex = `${messageData.id}-${codeString.substring(0, 20)}`;

                  if (!inline && match) {
                    return (
                      <div className="relative group my-2">
                        <Button
                          size="small"
                          type="text"
                          icon={
                            copiedCode === codeIndex ? (
                              <CheckOutlined />
                            ) : (
                              <CopyOutlined />
                            )
                          }
                          onClick={() =>
                            handleCopyCode(codeString, parseInt(codeIndex))
                          }
                          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white hover:bg-gray-600"
                        />
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          className="rounded"
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="bg-gray-200 text-red-600 px-1 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-4 mb-2">{children}</ul>;
                },
                ol({ children }) {
                  return (
                    <ol className="list-decimal pl-4 mb-2">{children}</ol>
                  );
                },
                li({ children }) {
                  return <li className="mb-1">{children}</li>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2 text-gray-700">
                      {children}
                    </blockquote>
                  );
                },
                h1({ children }) {
                  return (
                    <h1 className="text-2xl font-bold mb-2">{children}</h1>
                  );
                },
                h2({ children }) {
                  return (
                    <h2 className="text-xl font-bold mb-2">{children}</h2>
                  );
                },
                h3({ children }) {
                  return (
                    <h3 className="text-lg font-bold mb-2">{children}</h3>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ children }) {
                  return (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-bold">
                      {children}
                    </th>
                  );
                },
                td({ children }) {
                  return (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  );
                },
              }}
            >
              {messageData.content}
            </ReactMarkdown>
          )}
        </div>
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {formatTime(messageData.created_at)}
        </div>
      </div>
    </div>
  );
}
