'use client';

import { Stack, Card, Group, TextInput, Switch, Alert, LoadingOverlay } from '@mantine/core';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ClientsTable } from '@/components/clients/clients-table';
import { useClients } from '@/hooks/use-clients';

export default function ClientsPage() {
  const { clients, isLoading, error } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const filteredClients = clients?.filter(client => {
    // First filter by search query
    const matchesSearch = 
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Then filter by archived status
    if (!showArchived && client.status === 'ARCHIVED') {
      return false;
    }

    return matchesSearch;
  }) || [];

  if (error) {
    return (
      <Stack gap="xl">
        <PageHeader title="Manage Clients" />
        <Alert 
          variant="filled" 
          color="red" 
          title="Error" 
          icon={<IconAlertCircle />}
        >
          {error instanceof Error ? error.message : 'Failed to load clients'}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <PageHeader title="Manage Clients" />

      <Card withBorder pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Stack gap="md">
          <Group justify="space-between">
            <TextInput
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
            />
            <Switch
              label="Show archived clients"
              checked={showArchived}
              onChange={(event) => setShowArchived(event.currentTarget.checked)}
            />
          </Group>

          <ClientsTable clients={filteredClients} />
        </Stack>
      </Card>
    </Stack>
  );
} 