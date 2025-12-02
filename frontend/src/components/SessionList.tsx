'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, List, Typography, Input, Button } from 'antd';
import { useMessage } from '@/hooks/useMessage';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { useChatContext } from '@/contexts/ChatContext';
import { useTheme } from '@/contexts/ThemeContext';

const { Sider } = Layout;
const { Text } = Typography;

export default function SessionList() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { message, modal } = useMessage();
  const {
    sessions,
    currentSession,
    isLoading,
    createSession,
    deleteSession,
    updateSessionTitle,
  } = useChatContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      const newSession = await createSession('New Conversation');
      router.push(`/chat/${newSession.id}`);
    } catch (error) {
      message.error('Failed to create session');
    }
  };

  const handleSelect = (id: number) => {
    router.push(`/chat/${id}`);
  };

  const handleDelete = (id: number, title: string) => {
    modal.confirm({
      title: 'Delete Conversation?',
      content: `Are you sure you want to delete "${title}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const wasCurrentSession = currentSession?.id === id;
          await deleteSession(id);
          message.success('Conversation deleted');
          
          // Navigate to chat root if deleted current session
          if (wasCurrentSession) {
            router.push('/chat');
          }
        } catch (error) {
          message.error('Failed to delete conversation');
        }
      },
    });
  };

  const handleStartEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editTitle.trim()) return;
    
    try {
      await updateSessionTitle(editingId, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
      message.success('Title updated');
    } catch (error) {
      message.error('Failed to update title');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <Sider
      width={280}
      style={{
        background: isDark ? '#1f1f1f' : '#fafafa',
        borderRight: isDark ? '1px solid #434343' : '1px solid #e8e8e8',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '16px', borderBottom: isDark ? '1px solid #434343' : '1px solid #e8e8e8' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          block
          size="large"
          onClick={handleCreate}
          loading={isLoading}
        >
          New Chat
        </Button>
      </div>

      <div style={{ padding: '12px 16px' }}>
        <Input
          placeholder="Search conversations..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        <List
          dataSource={filteredSessions}
          loading={isLoading}
          locale={{ emptyText: 'No conversations yet' }}
          renderItem={(session) => {
            const isActive = currentSession?.id === session.id;
            const isEditing = editingId === session.id;

            return (
              <List.Item
                style={{
                  padding: '12px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isActive
                    ? isDark ? '#264f78' : '#e6f4ff'
                    : isDark ? '#262626' : '#ffffff',
                  border: isActive
                    ? '1px solid #1890ff'
                    : isDark ? '1px solid #434343' : '1px solid #e8e8e8',
                  transition: 'all 0.2s',
                }}
                onClick={() => !isEditing && handleSelect(session.id)}
                onMouseEnter={(e) => {
                  if (!isActive && !isEditing) {
                    e.currentTarget.style.background = isDark ? '#3a3a3a' : '#f5f5f5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isEditing) {
                    e.currentTarget.style.background = isDark ? '#262626' : '#ffffff';
                  }
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {isEditing ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        size="small"
                        maxLength={100}
                        suffix={
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <Button
                              type="text"
                              size="small"
                              icon={<CheckOutlined />}
                              onClick={handleSaveEdit}
                              style={{ color: '#52c41a' }}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<CloseOutlined />}
                              onClick={handleCancelEdit}
                              danger
                            />
                          </div>
                        }
                        onPressEnter={handleSaveEdit}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <Text
                        strong
                        style={{
                          display: 'block',
                          marginBottom: '4px',
                          color: isActive ? '#1890ff' : isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {session.title}
                      </Text>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: '12px',
                          display: 'block',
                        }}
                      >
                        {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                      </Text>
                    </>
                  )}
                </div>

                {!isEditing && (
                  <div
                    style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="text"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleStartEdit(session.id, session.title)}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDelete(session.id, session.title)}
                    />
                  </div>
                )}
              </List.Item>
            );
          }}
        />
      </div>
    </Sider>
  );
}
