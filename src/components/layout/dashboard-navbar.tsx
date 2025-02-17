'use client';

import { NavLink, Stack, Text } from '@mantine/core';
import {
  IconDashboard,
  IconHeartHandshake,
  IconBuildingBank,
  IconFileAnalytics,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { label: 'Dashboard', icon: IconDashboard, href: '/dashboard' },
  { label: 'Charity Discovery', icon: IconHeartHandshake, href: '/dashboard/charities' },
  { label: 'DAF Management', icon: IconBuildingBank, href: '/dashboard/dafs' },
  { label: 'Tax Documents', icon: IconFileAnalytics, href: '/dashboard/documents' },
  { label: 'Network', icon: IconUsers, href: '/dashboard/network' },
  { label: 'Settings', icon: IconSettings, href: '/dashboard/settings' },
];

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} c="dimmed" mb="xs">
        Main Navigation
      </Text>

      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          component={Link}
          href={item.href}
          label={item.label}
          leftSection={<item.icon size={20} stroke={1.5} />}
          active={pathname === item.href}
        />
      ))}
    </Stack>
  );
} 