'use client';

import { useState } from 'react';
import { ActionIcon, Group, Modal, Select, Stack, TextInput, Button } from '@mantine/core';
import { IconPlus, IconUser } from '@tabler/icons-react';
import { useCreateClient } from '@/hooks/use-create-client';
import { notifications } from '@mantine/notifications';

interface Client {
  id: string;
  name: string;
  email: string;
  dafs: number;
  totalValue: number;
  lastActivity: string;
}

interface ClientSelectorProps {
  clients: Client[];
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
  const { createClient, isLoading, error } = useCreateClient();

  const handleSubmit = async () => {
    if (!newClientName || !newClientEmail) return;
    
    try {
      await createClient({
        firstName: newClientName.split(' ')[0],
        lastName: newClientName.split(' ').slice(1).join(' ') || '',
        email: newClientEmail,
        status: 'PENDING',
        advisorId: 'current-advisor-id', // This should come from your auth context
        preferredContactMethod: 'email',
        relationshipStartDate: new Date().toISOString(),
        secondaryAdvisors: [],
        causeAreas: [],
      });

      await onAddClient(newClientName, newClientEmail);
      setOpened(false);
      setNewClientName('');
      setNewClientEmail('');
      
      notifications.show({
        title: 'Success',
        message: 'Client created successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create client',
        color: 'red',
      });
    }
  };

  return (
    <>
      <Group gap="xs">
        <Select
          placeholder="Select client"
          value={selectedClientId}
          onChange={(value) => value && onClientChange(value)}
          data={clients.map((client) => ({
            value: client.id,
            label: client.name,
          }))}
          leftSection={<IconUser size={16} />}
          clearable
          searchable
          w={250}
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
            error={error}
            data-autofocus
          />
          <TextInput
            label="Email"
            placeholder="Enter client email"
            value={newClientEmail}
            onChange={event => setNewClientEmail(event.currentTarget.value)}
            error={error}
          />
          <Group justify="flex-end">
            <Button
              variant="filled"
              color="blue"
              loading={isLoading}
              onClick={handleSubmit}
              disabled={!newClientName || !newClientEmail}
            >
              Add Client
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
} 