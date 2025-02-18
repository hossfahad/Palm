'use client';

import { useState } from 'react';
import { ActionIcon, Group, Modal, Stack, TextInput, Button, Switch, Box, Divider, Combobox, InputBase, useCombobox } from '@mantine/core';
import { IconPlus, IconUser, IconChevronDown } from '@tabler/icons-react';
import { useCreateClient } from '@/hooks/use-create-client';
import { notifications } from '@mantine/notifications';

interface Client {
  id: string;
  name: string;
  email: string;
  dafs: number;
  totalValue: number;
  lastActivity: string;
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';
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
  const [showArchived, setShowArchived] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [search, setSearch] = useState('');
  const { createClient, isLoading, error } = useCreateClient();
  const combobox = useCombobox({
    onDropdownClose: () => {
      setSearch('');
    }
  });

  const hasArchivedClients = clients.some(client => client.status === 'ARCHIVED');
  const filteredClients = clients.filter(client => 
    (showArchived || client.status !== 'ARCHIVED') &&
    (client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedClient = clients.find(client => client.id === selectedClientId);

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
        <Combobox
          onOptionSubmit={(value) => {
            onClientChange(value);
            setSearch('');
            combobox.closeDropdown();
          }}
          store={combobox}
        >
          <Combobox.Target>
            <InputBase
              component="button"
              type="button"
              pointer
              rightSection={<IconChevronDown size={16} />}
              leftSection={<IconUser size={16} />}
              w={250}
              onClick={() => combobox.toggleDropdown()}
              rightSectionPointerEvents="none"
            >
              {selectedClient ? (
                <span style={{
                  color: selectedClient.status === 'ARCHIVED' ? 'var(--mantine-color-gray-6)' : undefined,
                  fontStyle: selectedClient.status === 'ARCHIVED' ? 'italic' : undefined,
                }}>
                  {selectedClient.name}
                  {selectedClient.status === 'ARCHIVED' && ' (Archived)'}
                </span>
              ) : (
                <span style={{ color: 'var(--mantine-color-placeholder)' }}>
                  Select client
                </span>
              )}
            </InputBase>
          </Combobox.Target>

          <Combobox.Dropdown>
            <Stack gap="xs">
              <Combobox.Search
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
                placeholder="Search clients..."
              />
              
              {hasArchivedClients && (
                <Box px="xs">
                  <Switch
                    label="Show archived clients"
                    checked={showArchived}
                    onChange={(event) => setShowArchived(event.currentTarget.checked)}
                    size="sm"
                  />
                </Box>
              )}

              <Divider />

              <Combobox.Options>
                {filteredClients.length === 0 ? (
                  <Combobox.Empty>No clients found</Combobox.Empty>
                ) : (
                  filteredClients.map((client) => (
                    <Combobox.Option
                      key={client.id}
                      value={client.id}
                      disabled={client.status === 'ARCHIVED' && !showArchived}
                      style={{
                        color: client.status === 'ARCHIVED' ? 'var(--mantine-color-gray-6)' : undefined,
                        fontStyle: client.status === 'ARCHIVED' ? 'italic' : undefined,
                      }}
                    >
                      {client.name}
                      {client.status === 'ARCHIVED' && ' (Archived)'}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Stack>
          </Combobox.Dropdown>
        </Combobox>

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