'use client';

import { Box, Group, Avatar, Menu } from '@mantine/core';
import { IconUser, IconLogout, IconSettings } from '@tabler/icons-react';
import { Logo } from '@/components/brand/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { notifications } from '@mantine/notifications';
import { useUser } from '@/lib/contexts/user-context';

export function StickyHeader() {
  const router = useRouter();
  const supabase = createClient();
  const { role, clientName } = useUser();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      notifications.show({
        title: 'Success',
        message: 'You have been signed out successfully',
        color: 'green',
      });
      
      router.push('/auth/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to sign out',
        color: 'red',
      });
    }
  };

  return (
    <Box
      h={60}
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group h="100%" px="md" justify="space-between">
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>
        
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Avatar 
              radius="xl" 
              size="md"
              style={{ cursor: 'pointer' }}
            >
              <IconUser size={20} />
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            {role === 'client' && (
              <Menu.Label>Viewing as: {clientName}</Menu.Label>
            )}
            <Menu.Item
              component={Link}
              href="/dashboard/settings"
              leftSection={<IconSettings size={16} />}
            >
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={16} />}
              onClick={handleSignOut}
            >
              Sign Out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
} 