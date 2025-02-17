'use client';

import { useState } from 'react';
import { ActionIcon, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ClientSummary } from '@/types/client';

interface ClientSelectorProps {
  clients: ClientSummary[];
  selectedClientId: string | null;
  onClientChange: (clientId: string) => void;
  onAddClient: (name: string, email: string) => Promise<void>;
}

export function ClientSelector({
  clients,
  selectedClientId,
  onClientChange,
  onAddClient,
}: ClientSelectorProps) {
  const [opened, setOpened] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newClientName || !newClientEmail) return;
    
    setIsSubmitting(true);
    try {
      await onAddClient(newClientName, newClientEmail);
      setOpened(false);
      setNewClientName('');
      setNewClientEmail('');
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Group gap="xs">
        <Select
          placeholder="Select a client"
          data={clients.map(client => ({
            value: client.id,
            label: client.name,
          }))}
          value={selectedClientId}
          onChange={value => value && onClientChange(value)}
          style={{ minWidth: 200 }}
        />
        <ActionIcon
          variant="light"
          size="lg"
          aria-label="Add new client"
          onClick={() => setOpened(true)}
        >
          <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New Client"
        centered
      >
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter client name"
            value={newClientName}
            onChange={event => setNewClientName(event.currentTarget.value)}
            data-autofocus
          />
          <TextInput
            label="Email"
            placeholder="Enter client email"
            value={newClientEmail}
            onChange={event => setNewClientEmail(event.currentTarget.value)}
          />
          <Group justify="flex-end">
            <ActionIcon
              variant="filled"
              size="lg"
              color="blue"
              loading={isSubmitting}
              onClick={handleSubmit}
              disabled={!newClientName || !newClientEmail}
            >
              <IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 