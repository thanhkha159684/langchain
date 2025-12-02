'use client';

import { useState } from 'react';
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserRegister } from '@/types/auth.types';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const onFinish = async (values: UserRegister) => {
    setLoading(true);
    try {
      await register(values);
      message.success('Registration successful! Redirecting to chat...');
      router.push('/chat');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed. Please try again.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white py-12 px-4">
      <Card className="w-full max-w-md shadow-sm" styles={{ body: { padding: '48px' } }}>
        <div className="text-center mb-12">
          <Title level={2} className="!mb-4">Create Account</Title>
          <Text type="secondary" className="text-base">Sign up to start chatting with AI</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input your username!' },
              { min: 3, message: 'Username must be at least 3 characters' },
              { max: 50, message: 'Username must be at most 50 characters' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores',
              },
            ]}
            className="mb-5"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
            className="mb-5"
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter email"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Password must contain uppercase, lowercase, and number',
              },
            ]}
            hasFeedback
            className="mb-5"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
            className="mb-5"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm password"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="rounded-md h-12"
            >
              Sign Up
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text type="secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
