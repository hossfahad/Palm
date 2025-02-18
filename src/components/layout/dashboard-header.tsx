'use client';

import { Group, Text, Button, Menu, ActionIcon } from '@mantine/core';
import { IconUser, IconLogout, IconUsers, IconShoppingBag, IconLayoutDashboard } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/lib/contexts/user-context';

const navigation = {
  advisor: [
    { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
    { name: 'Clients', href: '/dashboard/manage/clients', icon: IconUsers },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: IconShoppingBag },
  ],
  client: [
    { name: 'Dashboard', href: '/dashboard', icon: IconLayoutDashboard },
    { name: 'Access', href: '/dashboard/access', icon: IconUsers },
    { name: 'Marketplace', href: '/dashboard/marketplace', icon: IconShoppingBag },
  ],
};

export function DashboardHeader() {
  const pathname = usePathname();
  const { role, clientName, exitClientView } = useUser();

  const links = navigation[role].map((item) => (
    <Button
      key={item.name}
      component={Link}
      href={item.href}
      variant={pathname === item.href ? 'light' : 'subtle'}
      leftSection={<item.icon size={16} />}
      styles={{
        root: {
          backgroundColor: pathname === item.href ? 'var(--mantine-color-gray-1)' : 'transparent',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-1)',
          },
        },
      }}
    >
      {item.name}
    </Button>
  ));

  return (
    <Group justify="space-between" p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}>
      <Group gap="sm">
        {links}
      </Group>

      <Group>
        {role === 'client' && (
          <Button
            variant="subtle"
            color="gray"
            onClick={exitClientView}
            leftSection={<IconLogout size={16} />}
          >
            Exit Client View
          </Button>
        )}
      </Group>
    </Group>
  );
} 