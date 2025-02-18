'use client';

import { useState } from 'react';
import {
  Stack,
  Card,
  Table,
  Group,
  Text,
  Button,
  ActionIcon,
  Menu,
  TextInput,
  Badge,
  Modal,
  LoadingOverlay,
  Select,
  Alert,
  Switch,
} from '@mantine/core';
import { 
  IconSearch, 
  IconDotsVertical, 
  IconPencil, 
  IconArchive, 
  IconUserPlus,
  IconAlertCircle,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import { PageHeader } from '@/components/layout/page-header';
import { useClients, Client, CreateClientInput } from '@/hooks/use-clients';

type ClientStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ARCHIVED';

const statusColors: Record<ClientStatus, string> = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  INACTIVE: 'red',
  ARCHIVED: 'gray'
};

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'ARCHIVED', label: 'Archived' }
];

const contactMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'mail', label: 'Mail' }
];

export default function ClientsPage() {
  const { 
    clients, 
    isLoading, 
    error, 
    createClient,
    updateClient,
    archiveClient,
    isCreating,
    isUpdating,
    isArchiving,
    refetch 
  } = useClients();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<CreateClientInput>>({
    firstName: '',
    lastName: '',
    email: '',
    preferredContactMethod: 'email',
    causeAreas: [],
  });

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

  const handleCreateClient = async () => {
    try {
      await createClient({
        ...newClient,
        advisorId: 'current-advisor-id', // This should come from auth context
      } as CreateClientInput);
      
      notifications.show({
        title: 'Success',
        message: 'Client created successfully',
        color: 'green'
      });
      setIsAddModalOpen(false);
      setNewClient({
        firstName: '',
        lastName: '',
        email: '',
        preferredContactMethod: 'email',
        causeAreas: [],
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create client',
        color: 'red'
      });
    }
  };

  const handleEditClient = async () => {
    if (!selectedClient) return;

    try {
      await updateClient({
        id: selectedClient.id,
        data: {
          firstName: selectedClient.firstName,
          lastName: selectedClient.lastName,
          email: selectedClient.email,
          phone: selectedClient.phone,
          preferredName: selectedClient.preferredName,
          preferredPronouns: selectedClient.preferredPronouns,
          preferredContactMethod: selectedClient.preferredContactMethod,
          timeZone: selectedClient.timeZone,
          causeAreas: selectedClient.causeAreas,
        }
      });
      notifications.show({
        title: 'Success',
        message: 'Client updated successfully',
        color: 'green'
      });
      setIsEditModalOpen(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update client',
        color: 'red'
      });
    }
  };

  const handleArchiveClient = async () => {
    if (!selectedClient) return;
    
    try {
      await archiveClient(selectedClient.id);
      notifications.show({
        title: 'Success',
        message: 'Client archived successfully',
        color: 'green'
      });
      setIsArchiveModalOpen(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to archive client',
        color: 'red'
      });
    }
  };

  const handleClientUpdate = (field: keyof Client, value: any) => {
    if (!selectedClient) return;
    setSelectedClient(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

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
      <PageHeader 
        title="Manage Clients" 
        action={
          <Button 
            leftSection={<IconUserPlus size={16} />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Client
          </Button>
        }
      />

      <Card withBorder pos="relative">
        <LoadingOverlay visible={isLoading || isArchiving} />
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

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Contact Method</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredClients.map((client) => (
                <Table.Tr 
                  key={client.id}
                  style={{
                    color: client.status === 'ARCHIVED' ? 'var(--mantine-color-gray-6)' : undefined,
                    fontStyle: client.status === 'ARCHIVED' ? 'italic' : undefined,
                  }}
                >
                  <Table.Td>
                    <Text fw={500}>
                      {client.firstName} {client.lastName}
                      {client.preferredName && (
                        <Text span size="sm" c="dimmed" ml={4}>
                          ({client.preferredName})
                        </Text>
                      )}
                      {client.status === 'ARCHIVED' && (
                        <Text span size="sm" c="dimmed" ml={4}>
                          (Archived)
                        </Text>
                      )}
                    </Text>
                  </Table.Td>
                  <Table.Td>{client.email}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[client.status]}>
                      {client.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text tt="capitalize">
                      {client.preferredContactMethod}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    {format(new Date(client.createdAt), 'MMM d, yyyy')}
                  </Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end" withinPortal>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          leftSection={<IconPencil size={14} />}
                          onClick={() => {
                            setSelectedClient(client);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Edit Client
                        </Menu.Item>
                        {client.status !== 'ARCHIVED' && (
                          <Menu.Item
                            color="red"
                            leftSection={<IconArchive size={14} />}
                            onClick={() => {
                              setSelectedClient(client);
                              setIsArchiveModalOpen(true);
                            }}
                          >
                            Archive Client
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Card>

      {/* Add Modal */}
      <Modal
        opened={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
      >
        <Stack>
          <TextInput
            label="First Name"
            required
            value={newClient.firstName}
            onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
          />
          <TextInput
            label="Last Name"
            required
            value={newClient.lastName}
            onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
          />
          <TextInput
            label="Email"
            required
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
          />
          <TextInput
            label="Phone"
            value={newClient.phone || ''}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
          />
          <Select
            label="Preferred Contact Method"
            required
            value={newClient.preferredContactMethod}
            onChange={(value) => setNewClient({ 
              ...newClient, 
              preferredContactMethod: value as 'email' | 'phone' | 'mail' 
            })}
            data={contactMethodOptions}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateClient}
              loading={isCreating}
              disabled={!newClient.firstName || !newClient.lastName || !newClient.email}
            >
              Create Client
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Client"
      >
        {selectedClient && (
          <Stack>
            <TextInput
              label="First Name"
              required
              value={selectedClient.firstName}
              onChange={(e) => handleClientUpdate('firstName', e.target.value)}
            />
            <TextInput
              label="Last Name"
              required
              value={selectedClient.lastName}
              onChange={(e) => handleClientUpdate('lastName', e.target.value)}
            />
            <TextInput
              label="Email"
              required
              value={selectedClient.email}
              onChange={(e) => handleClientUpdate('email', e.target.value)}
            />
            <TextInput
              label="Phone"
              value={selectedClient.phone || ''}
              onChange={(e) => handleClientUpdate('phone', e.target.value)}
            />
            <TextInput
              label="Preferred Name"
              value={selectedClient.preferredName || ''}
              onChange={(e) => handleClientUpdate('preferredName', e.target.value)}
            />
            <Select
              label="Status"
              required
              value={selectedClient.status}
              onChange={(value) => handleClientUpdate('status', value)}
              data={statusOptions}
            />
            <Select
              label="Preferred Contact Method"
              required
              value={selectedClient.preferredContactMethod}
              onChange={(value) => handleClientUpdate('preferredContactMethod', value)}
              data={contactMethodOptions}
            />
            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditClient}
                loading={isUpdating}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        opened={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive Client"
      >
        <Stack>
          <Text>
            Are you sure you want to archive {selectedClient?.firstName} {selectedClient?.lastName}?
            This will hide the client from active views but their data will be preserved.
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setIsArchiveModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              color="orange" 
              onClick={handleArchiveClient}
              loading={isArchiving}
            >
              Archive
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
} 