'use client';

import { useState } from 'react';
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Menu,
  Button,
  Modal,
  Stack,
  Select,
  Switch,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconShieldLock,
} from '@tabler/icons-react';
import { UserRole, UserPermissions, rolePermissions } from '@/types/auth';

interface User {
  id: string;
  email: string;
  role: UserRole;
  has2FAEnabled: boolean;
}

interface RoleManagementProps {
  users: User[];
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
}

export function RoleManagement({
  users,
  onUpdateRole,
  onDeleteUser,
}: RoleManagementProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const handleRoleUpdate = async (newRole: UserRole) => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await onUpdateRole(selectedUser.id, newRole);
      notifications.show({
        title: 'Role Updated',
        message: `Successfully updated role for ${selectedUser.email}`,
        color: 'green',
      });
      close();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update user role',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.email}?`
    );
    if (!confirmed) return;

    try {
      await onDeleteUser(user.id);
      notifications.show({
        title: 'User Deleted',
        message: `Successfully deleted ${user.email}`,
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete user',
        color: 'red',
      });
    }
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>
        <Text size="sm">{user.email}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Text size="sm" tt="capitalize">
            {user.role}
          </Text>
          {user.has2FAEnabled && (
            <IconShieldLock
              size={16}
              stroke={1.5}
              style={{ color: 'var(--mantine-color-blue-filled)' }}
            />
          )}
        </Group>
      </Table.Td>
      <Table.Td>
        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEdit size={16} stroke={1.5} />}
              onClick={() => {
                setSelectedUser(user);
                open();
              }}
            >
              Edit Role
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={16} stroke={1.5} />}
              color="red"
              onClick={() => handleDeleteUser(user)}
            >
              Delete User
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Modal
        opened={opened}
        onClose={close}
        title="Edit User Role"
        centered
        size="md"
      >
        {selectedUser && (
          <Stack gap="md">
            <Text size="sm">
              Editing role for <b>{selectedUser.email}</b>
            </Text>

            <Select
              label="Role"
              defaultValue={selectedUser.role}
              data={Object.entries(UserRole).map(([key, value]) => ({
                value,
                label: key.charAt(0) + key.slice(1).toLowerCase(),
              }))}
              onChange={(value) => value && handleRoleUpdate(value as UserRole)}
            />

            <Text size="sm" fw={500}>
              Role Permissions
            </Text>

            {Object.entries(rolePermissions[selectedUser.role]).map(
              ([key, value]) => (
                <Switch
                  key={key}
                  label={key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                  checked={value}
                  readOnly
                />
              )
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Cancel
              </Button>
              <Button loading={loading} onClick={() => handleRoleUpdate(selectedUser.role)}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
} 