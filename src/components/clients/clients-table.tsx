import { useState } from 'react';
import { Table, Menu, Badge, ActionIcon, Group } from '@mantine/core';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useClients } from '@/hooks/use-clients';
import { Client } from '@/lib/services/client-service';
import { notifications } from '@mantine/notifications';

const statusColors: Record<Client['status'], string> = {
  ACTIVE: 'green',
  PENDING: 'yellow',
  INACTIVE: 'gray',
  ARCHIVED: 'red',
};

export function ClientsTable() {
  const { clients, isLoading, error, deleteClient } = useClients();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading clients</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteClient.mutateAsync(id);
      notifications.show({
        title: 'Success',
        message: 'Client has been deleted successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete client. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Advisor</Table.Th>
          <Table.Th>Start Date</Table.Th>
          <Table.Th style={{ width: 70 }}></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {clients?.map((client) => (
          <Table.Tr key={client.id}>
            <Table.Td>
              <Group gap="sm">
                {client.firstName} {client.lastName}
                {client.preferredName && (
                  <span style={{ color: 'gray', fontSize: '0.875rem' }}>
                    ({client.preferredName})
                  </span>
                )}
              </Group>
            </Table.Td>
            <Table.Td>{client.email}</Table.Td>
            <Table.Td>
              <Badge color={statusColors[client.status]}>
                {client.status}
              </Badge>
            </Table.Td>
            <Table.Td>{client.advisorId}</Table.Td>
            <Table.Td>
              {format(new Date(client.relationshipStartDate), 'PP')}
            </Table.Td>
            <Table.Td>
              <Menu position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" size="sm">
                    <IconDots size="1rem" />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconPencil size="1rem" />}
                    onClick={() => setSelectedClient(client)}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size="1rem" />}
                    color="red"
                    onClick={() => handleDelete(client.id)}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
} 