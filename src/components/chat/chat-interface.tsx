'use client';

import { useState, useEffect, useRef } from 'react';
import { Paper, Stack, TextInput, Button, ScrollArea, Text, Group, Avatar, ActionIcon } from '@mantine/core';
import { IconSend, IconRefresh } from '@tabler/icons-react';
import { Message, ChatService } from '@/lib/services/chat-service';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<void>;
  messages?: Message[];
  isLoading?: boolean;
  onReset?: () => void;
}

export function ChatInterface({ 
  onSendMessage,
  messages: externalMessages,
  isLoading: externalIsLoading,
  onReset
}: ChatInterfaceProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);

  const messages = externalMessages || localMessages;
  const isLoading = externalIsLoading || isLocalLoading;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Add default welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        role: 'assistant',
        content: 'Ask me about any charity or non-profit',
      };
      if (externalMessages) {
        onSendMessage?.(welcomeMessage.content);
      } else {
        setLocalMessages([welcomeMessage]);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    if (onSendMessage) {
      await onSendMessage(input.trim());
    } else {
      setLocalMessages((prev) => [...prev, userMessage]);
      setIsLocalLoading(true);

      try {
        const newMessages = [...localMessages, userMessage];
        const response = await ChatService.sendMessage(newMessages);
        setLocalMessages((prev) => [...prev, response]);
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsLocalLoading(false);
      }
    }
    
    setInput('');
  };

  return (
    <Paper 
      radius="lg" 
      withBorder
      style={{
        background: 'linear-gradient(180deg, rgba(148, 163, 141, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
        borderColor: 'rgba(148, 163, 141, 0.3)',
      }}
    >
      <Stack gap={0}>
        {/* Chat Header */}
        <Group 
          p="md" 
          justify="space-between" 
          style={{ 
            borderBottom: '1px solid rgba(148, 163, 141, 0.2)',
            background: 'linear-gradient(180deg, rgba(148, 163, 141, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
          }}
        >
          <Text fw={500} c="gray.8">AI Assistant</Text>
          {onReset && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={onReset}
              disabled={isLoading || messages.length === 0}
              title="Reset conversation"
            >
              <IconRefresh size={18} />
            </ActionIcon>
          )}
        </Group>

        {/* Messages Area */}
        <ScrollArea h={400} p="md" viewportRef={viewport}>
          <Stack gap="md">
            {messages.map((message, index) => (
              <Group
                key={index}
                wrap="nowrap"
                align="flex-start"
                gap="sm"
                style={{
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  size="sm"
                  radius="xl"
                  color={message.role === 'user' ? 'blue' : 'teal'}
                >
                  {message.role === 'user' ? 'U' : 'A'}
                </Avatar>
                <Paper
                  p="xs"
                  radius="md"
                  style={{
                    backgroundColor:
                      message.role === 'user'
                        ? 'var(--mantine-color-blue-0)'
                        : message.role === 'assistant'
                        ? 'rgba(148, 163, 141, 0.1)'
                        : 'var(--mantine-color-gray-0)',
                    maxWidth: '80%',
                  }}
                >
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <Text size="sm">{children}</Text>,
                        h1: ({ children }) => <Text size="lg" fw={700} mb={8}>{children}</Text>,
                        h2: ({ children }) => <Text size="md" fw={600} mb={6}>{children}</Text>,
                        h3: ({ children }) => <Text size="sm" fw={600} mb={4}>{children}</Text>,
                        ul: ({ children }) => <Stack gap={4} mt={4} mb={4}>{children}</Stack>,
                        li: ({ children }) => (
                          <Group gap={6} align="flex-start">
                            <Text size="sm" component="span" mt={6}>•</Text>
                            <Text size="sm">{children}</Text>
                          </Group>
                        ),
                        a: ({ href, children }) => (
                          <Text
                            component="a"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            c="blue"
                            style={{ textDecoration: 'none' }}
                          >
                            {children}
                          </Text>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </Paper>
              </Group>
            ))}
            {isLoading && (
              <Group wrap="nowrap" align="flex-start" gap="sm">
                <Avatar size="sm" radius="xl" color="teal">
                  A
                </Avatar>
                <Paper p="xs" radius="md" style={{ backgroundColor: 'rgba(148, 163, 141, 0.1)' }}>
                  <Text size="sm">Thinking...</Text>
                </Paper>
              </Group>
            )}
          </Stack>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSubmit}>
          <Group 
            p="md" 
            style={{ 
              borderTop: '1px solid rgba(148, 163, 141, 0.2)',
              background: 'linear-gradient(0deg, rgba(148, 163, 141, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
            }}
          >
            <TextInput
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
              disabled={isLoading}
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:focus': {
                    backgroundColor: 'white',
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="filled"
              disabled={!input.trim() || isLoading}
              rightSection={<IconSend size={16} />}
              style={{
                background: 'linear-gradient(180deg, rgba(148, 163, 141, 1) 0%, rgba(128, 143, 121, 1) 100%)',
              }}
              styles={{
                root: {
                  '&:not(:disabled):hover': {
                    background: 'linear-gradient(180deg, rgba(138, 153, 131, 1) 0%, rgba(118, 133, 111, 1) 100%)',
                  },
                  '&:disabled': {
                    backgroundColor: 'var(--mantine-color-gray-4)',
                    color: 'var(--mantine-color-white)',
                  },
                },
              }}
            >
              Send
            </Button>
          </Group>
        </form>
      </Stack>
    </Paper>
  );
} 