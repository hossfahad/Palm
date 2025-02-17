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
} from '@mantine/core';
import { IconSearch, IconDotsVertical, IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { PageHeader } from '@/components/layout/page-header';

interface Client {
  id: string;
  name: string;
  email: string;
  dafs: number;
  totalValue: number;
  lastActivity: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    dafs: 2,
    totalValue: 2800000,
    lastActivity: '2024-02-20',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    dafs: 1,
    totalValue: 1500000,
    lastActivity: '2024-02-19',
  },
];

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = mockClients.filter(
    client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack gap="xl">
      <PageHeader 
        title="Manage Clients" 
        action={
          <Button 
            leftSection={<IconUserPlus size={16} />}
            variant="filled"
            color="sage"
          >
            Add Client
          </Button>
        }
      />

      <Card withBorder>
        <Stack gap="md">
          <TextInput
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
          />

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>DAFs</Table.Th>
                <Table.Th>Total Value</Table.Th>
                <Table.Th>Last Activity</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredClients.map((client) => (
                <Table.Tr key={client.id}>
                  <Table.Td>
                    <Text fw={500}>{client.name}</Text>
                  </Table.Td>
                  <Table.Td>{client.email}</Table.Td>
                  <Table.Td>{client.dafs}</Table.Td>
                  <Table.Td>${client.totalValue.toLocaleString()}</Table.Td>
                  <Table.Td>{new Date(client.lastActivity).toLocaleDateString()}</Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />}>
                          Edit Client
                        </Menu.Item>
                        <Menu.Item 
                          leftSection={<IconTrash size={14} />}
                          color="red"
                        >
                          Remove Client
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Card>
    </Stack>
  );
} 