'use client';

import { Stack, ActionIcon, Tooltip, Avatar, Menu } from '@mantine/core';
import {
  IconHome,
  IconBuildingStore,
  IconSettings,
  IconLogout,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardNavbar() {
  const pathname = usePathname();

  const navItems = [
    { icon: IconHome, label: 'Dashboard', href: '/dashboard' },
    { 
      icon: IconBuildingStore, 
      label: 'Marketplace', 
      href: '/dashboard/marketplace',
    },
    { 
      icon: IconUsers, 
      label: 'Clients', 
      href: '/dashboard/manage/clients',
    },
    { 
      icon: IconSettings, 
      label: 'Permissions', 
      href: '/dashboard/manage/permissions',
    },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Stack h="100%" justify="space-between" align="center">
      <Stack gap="xs" align="center">
        <Menu shadow="md" width={200} position="right-start">
          <Menu.Target>
            <Avatar size="md" radius="xl" style={{ cursor: 'pointer' }} />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item
              component={Link}
              href="/dashboard/profile"
              leftSection={<IconUser size={14} />}
            >
              Profile Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={14} />}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        
        {navItems.map((item) => (
          <Tooltip
            key={item.href}
            label={item.label}
            position="right"
            withArrow
            transitionProps={{ duration: 0 }}
          >
            <ActionIcon
              component={Link}
              href={item.href}
              variant={isActive(item.href) ? 'light' : 'subtle'}
              color={isActive(item.href) ? 'sage' : 'gray'}
              size="lg"
              radius="md"
            >
              <item.icon size={20} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  );
} 