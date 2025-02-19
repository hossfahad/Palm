'use client';

import { useState } from 'react';
import { Table, Menu, Badge, ActionIcon, Group, Text, Button } from '@mantine/core';
import { IconDots, IconPencil, IconArchive, IconEye } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useClients } from '@/hooks/use-clients';
import { notifications } from '@mantine/notifications';
import { useUser } from '@/lib/contexts/user-context';
import { Client } from '@/hooks/use-clients';
import { useRouter } from 'next/navigation';
import { EditClientModal } from './edit-client-modal';

interface ClientsTableProps {
  clients: Client[];
}

const statusColors: Record<string, string> = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  INACTIVE: 'red',
  ARCHIVED: 'gray'
};

export function ClientsTable({ clients }: ClientsTableProps) {
  const { archiveClient, isArchiving } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { enterClientView } = useUser();
  const router = useRouter();

  const handleArchive = async (client: Client) => {
    try {
      await archiveClient(client.id);
      notifications.show({
        title: 'Success',
        message: 'Client has been archived successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to archive client',
        color: 'red',
      });
    }
  };

  const handleEnterClientView = (client: Client) => {
    console.log('Entering client view for:', client);
    enterClientView(client.id, `${client.firstName} ${client.lastName}`);
    // Navigate to dashboard after switching to client view
    router.push('/dashboard');
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setEditModalOpen(true);
  };

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Advisor</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th style={{ width: 200 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {clients.map((client) => (
            <Table.Tr key={client.id}>
              <Table.Td>
                <Text fw={500}>
                  {client.firstName} {client.lastName}
                  {client.preferredName && (
                    <Text span size="sm" c="dimmed" ml={4}>
                      ({client.preferredName})
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
              <Table.Td>{client.advisorId}</Table.Td>
              <Table.Td>
                {format(new Date(client.createdAt), 'MMM d, yyyy')}
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end">
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    leftSection={<IconEye size={16} />}
                    onClick={() => handleEnterClientView(client)}
                  >
                    View as Client
                  </Button>
                  <Menu shadow="md" position="bottom-end">
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        loading={isArchiving && selectedClient?.id === client.id}
                      >
                        <IconDots size="1rem" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconPencil size="1rem" />}
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </Menu.Item>
                      {client.status !== 'ARCHIVED' && (
                        <Menu.Item
                          leftSection={<IconArchive size="1rem" />}
                          color="yellow"
                          onClick={() => {
                            setSelectedClient(client);
                            handleArchive(client);
                          }}
                        >
                          Archive
                        </Menu.Item>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <EditClientModal
        client={selectedClient}
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedClient(null);
        }}
      />
    </>
  );
} 