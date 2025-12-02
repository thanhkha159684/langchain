'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserLogin } from '@/types/auth.types';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onFinish = async (values: UserLogin) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful! Redirecting...');
      router.push('/chat');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Title level={2}>Welcome Back</Title>
          <Text type="secondary">Sign in to continue chatting</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            label="Username or Email"
            rules={[
              { required: true, message: 'Please input your username or email!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username or email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700">
                Sign up
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
