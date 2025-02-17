'use client';

import { useState } from 'react';
import {
  Title,
  Tabs,
  Paper,
  Stack,
  Text,
  Group,
  Button,
  Switch,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconUsers,
  IconShieldLock,
  IconBrush,
  IconPalette,
} from '@tabler/icons-react';
import { RoleManagement } from '@/components/settings/role-management';
import { BrandingSettings } from '@/components/settings/branding-settings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/types/auth';

interface User {
  id: string;
  email: string;
  role: UserRole;
  has2FAEnabled: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string | null>('roles');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: UserRole;
    }) => {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleUpdateRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ userId, newRole });
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      throw error;
    }
  };

  const handleSaveBranding = async (settings: any) => {
    try {
      const formData = new FormData();
      if (settings.logo) formData.append('logo', settings.logo);
      if (settings.favicon) formData.append('favicon', settings.favicon);
      formData.append('settings', JSON.stringify({
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        organizationName: settings.organizationName,
        useDarkMode: settings.useDarkMode,
      }));

      const response = await fetch('/api/organization/branding', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update branding');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Settings</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="roles" leftSection={<IconUsers size={16} />}>
            User Management
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShieldLock size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="branding" leftSection={<IconPalette size={16} />}>
            Branding
          </Tabs.Tab>
          <Tabs.Tab value="appearance" leftSection={<IconBrush size={16} />}>
            Appearance
          </Tabs.Tab>
        </Tabs.List>

        <Paper p="md" mt="md" withBorder>
          <Tabs.Panel value="roles">
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Manage user roles and permissions
              </Text>
              {isLoading ? (
                <Text>Loading users...</Text>
              ) : (
                <RoleManagement
                  users={users || []}
                  onUpdateRole={handleUpdateRole}
                  onDeleteUser={handleDeleteUser}
                />
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security">
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Configure security settings
              </Text>

              <Stack gap="xs">
                <Switch
                  label="Require 2FA for all users"
                  description="Force two-factor authentication for all user accounts"
                />
                <Switch
                  label="Auto-lock inactive sessions"
                  description="Automatically log out users after 30 minutes of inactivity"
                />
                <Switch
                  label="Password rotation"
                  description="Require password changes every 90 days"
                />
              </Stack>

              <Group mt="md">
                <Button variant="light">Reset Defaults</Button>
                <Button>Save Changes</Button>
              </Group>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="branding">
            <BrandingSettings onSave={handleSaveBranding} />
          </Tabs.Panel>

          <Tabs.Panel value="appearance">
            <Stack gap="md">
              <Text size="sm" c="dimmed">
                Customize the appearance of your dashboard
              </Text>

              <Stack gap="xs">
                <Switch
                  label="Dark mode"
                  description="Enable dark mode for the dashboard"
                />
                <Switch
                  label="Compact view"
                  description="Reduce spacing between elements"
                />
                <Switch
                  label="Show animations"
                  description="Enable interface animations"
                />
              </Stack>

              <Group mt="md">
                <Button variant="light">Reset Defaults</Button>
                <Button>Save Changes</Button>
              </Group>
            </Stack>
          </Tabs.Panel>
        </Paper>
      </Tabs>
    </Stack>
  );
} 