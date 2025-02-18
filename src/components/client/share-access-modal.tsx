'use client';

import { useState } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Select,
  Button,
  Text,
  Group,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconMail } from '@tabler/icons-react';

interface ShareAccessModalProps {
  clientId: string;
  clientName: string;
  opened: boolean;
  onClose: () => void;
}

const roles = [
  { value: 'VIEWER', label: 'Viewer' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'ADMIN', label: 'Administrator' },
];

export function ShareAccessModal({
  clientId,
  clientName,
  opened,
  onClose,
}: ShareAccessModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${clientId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        throw new Error('Failed to share access');
      }

      notifications.show({
        title: 'Access Shared',
        message: `An invitation has been sent to ${email}`,
        color: 'green',
      });

      onClose();
      setEmail('');
      setRole(null);
    } catch (error) {
      console.error('Error sharing access:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to share access. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Share Access to ${clientName}`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Share access to this client's profile with other team members.
            They will receive an email invitation to join.
          </Text>

          <TextInput
            label="Email Address"
            placeholder="colleague@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftSection={<IconMail size={16} />}
          />

          <Select
            label="Role"
            placeholder="Select a role"
            required
            data={roles}
            value={role}
            onChange={setRole}
          />

          <Text size="xs" c="dimmed">
            <strong>Viewer:</strong> Can view client information
            <br />
            <strong>Editor:</strong> Can edit client information and manage grants
            <br />
            <strong>Administrator:</strong> Full access including sharing permissions
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!email || !role}
            >
              Share Access
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 