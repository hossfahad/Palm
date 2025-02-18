'use client';

import { Container, Title, Text, Button, Stack, Paper, Group, CopyButton, TextInput } from '@mantine/core';
import { IconCopy, IconPlus, IconUsers } from '@tabler/icons-react';
import { useUser } from '@/lib/contexts/user-context';

export default function AccessPage() {
  const { clientId } = useUser();
  const shareUrl = `${window.location.origin}/invite/${clientId}`;

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <div>
            <Title order={1} fw={500} mb={4}>Family Access</Title>
            <Text c="dimmed">Invite family members to view and contribute to your charitable giving</Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            variant="filled"
            style={{
              background: 'linear-gradient(180deg, rgba(148, 163, 141, 1) 0%, rgba(128, 143, 121, 1) 100%)',
            }}
          >
            Add Family Member
          </Button>
        </Group>

        <Paper p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Group>
              <IconUsers size={24} style={{ color: 'var(--mantine-color-gray-6)' }} />
              <div>
                <Text fw={500}>Share Access Link</Text>
                <Text size="sm" c="dimmed">Share this link with family members to grant them access</Text>
              </div>
            </Group>

            <Group>
              <TextInput
                value={shareUrl}
                readOnly
                style={{ flex: 1 }}
              />
              <CopyButton value={shareUrl}>
                {({ copied, copy }) => (
                  <Button
                    color={copied ? 'teal' : 'blue'}
                    onClick={copy}
                    leftSection={<IconCopy size={16} />}
                  >
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                )}
              </CopyButton>
            </Group>
          </Stack>
        </Paper>

        {/* Family Members List - To be implemented */}
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Text fw={500}>Family Members</Text>
            <Text c="dimmed" size="sm">No family members have been added yet.</Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 