'use client';

import { useState } from 'react';
import { Paper, Stack, TextInput, Button, ScrollArea, Text, Group, Avatar, ActionIcon } from '@mantine/core';
import { IconSend, IconRefresh } from '@tabler/icons-react';
import { Message, ChatService } from '@/lib/services/chat-service';

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

  const messages = externalMessages || localMessages;
  const isLoading = externalIsLoading || isLocalLoading;

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
    <Paper radius="lg" withBorder>
      <Stack gap={0}>
        {/* Chat Header */}
        <Group p="md" justify="space-between" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
          <Text fw={500}>AI Assistant</Text>
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
        <ScrollArea h={400} p="md">
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
                        : 'var(--mantine-color-gray-0)',
                    maxWidth: '80%',
                  }}
                >
                  <Text size="sm">{message.content}</Text>
                </Paper>
              </Group>
            ))}
            {isLoading && (
              <Group wrap="nowrap" align="flex-start" gap="sm">
                <Avatar size="sm" radius="xl" color="teal">
                  A
                </Avatar>
                <Paper p="xs" radius="md" bg="gray.0">
                  <Text size="sm">Thinking...</Text>
                </Paper>
              </Group>
            )}
          </Stack>
        </ScrollArea>

        {/* Input Area */}
        <form onSubmit={handleSubmit}>
          <Group p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <TextInput
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="filled"
              color="white"
              disabled={!input.trim() || isLoading}
              rightSection={<IconSend size={16} />}
              styles={{
                root: {
                  color: 'var(--mantine-color-white)',
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