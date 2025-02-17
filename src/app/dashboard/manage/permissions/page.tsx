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
  Select,
} from '@mantine/core';
import { IconSearch, IconDotsVertical, IconEdit, IconTrash, IconUserPlus } from '@tabler/icons-react';
import { PageHeader } from '@/components/layout/page-header';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'disabled';
  lastLogin: string | null;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2024-02-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-02-19T15:45:00Z',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Advisor',
    status: 'invited',
    lastLogin: null,
  },
];

const roleColors: Record<string, string> = {
  Admin: 'red',
  Manager: 'blue',
  Advisor: 'green',
};

const statusColors: Record<string, string> = {
  active: 'green',
  invited: 'yellow',
  disabled: 'gray',
};

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = mockUsers.filter(
    user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack gap="xl">
      <PageHeader 
        title="Manage Permissions" 
        action={
          <Button 
            leftSection={<IconUserPlus size={16} />}
            variant="filled"
            color="sage"
          >
            Invite User
          </Button>
        }
      />

      <Card withBorder>
        <Stack gap="md">
          <TextInput
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftSection={<IconSearch size={16} />}
          />

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Last Login</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Text fw={500}>{user.name}</Text>
                  </Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>
                    <Badge color={roleColors[user.role]} variant="light">
                      {user.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={statusColors[user.status]} variant="dot">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString()
                      : 'Never'}
                  </Table.Td>
                  <Table.Td>
                    <Menu position="bottom-end" shadow="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEdit size={14} />}>
                          Edit Role
                        </Menu.Item>
                        {user.status === 'active' && (
                          <Menu.Item 
                            leftSection={<IconTrash size={14} />}
                            color="red"
                          >
                            Disable User
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
    </Stack>
  );
} 