'use client';

import { Stack, ActionIcon, Tooltip, Avatar, Menu, Box } from '@mantine/core';
import {
  IconHome,
  IconBuildingStore,
  IconSettings,
  IconUsers,
  IconLogout,
  IconUser,
  IconLeaf,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: IconHome, label: 'Dashboard', href: '/dashboard', exact: true },
    { 
      icon: IconBuildingStore, 
      label: 'Marketplace', 
      href: '/dashboard/marketplace',
      exact: false,
    },
    { 
      icon: IconUsers, 
      label: 'Clients', 
      href: '/dashboard/manage/clients',
      exact: false,
    },
    { 
      icon: IconSettings, 
      label: 'Settings', 
      href: '/dashboard/settings',
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    // TODO: Implement new sign out logic
    router.push('/');
  };

  return (
    <Stack 
      h="100%" 
      py="md" 
      px="xs" 
      justify="space-between"
      style={{
        backgroundColor: 'white',
        width: '4rem',
      }}
    >
      <Stack gap="xl" align="center">
        <Box py="md">
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <ActionIcon
              variant="subtle"
              color="sage"
              size="xl"
              aria-label="Home"
            >
              <IconLeaf size={24} />
            </ActionIcon>
          </Link>
        </Box>

        <Stack gap="lg">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Tooltip 
                label={item.label} 
                position="right"
                classNames={{
                  tooltip: inter.className
                }}
              >
                <ActionIcon
                  variant={isActive(item.href, item.exact) ? 'filled' : 'subtle'}
                  aria-label={item.label}
                  size="xl"
                  color="sage"
                >
                  <item.icon size={24} />
                </ActionIcon>
              </Tooltip>
            </Link>
          ))}
        </Stack>
      </Stack>

      <Box px="xs">
        <Menu shadow="md" width={200} position="right">
          <Menu.Target>
            <Avatar 
              radius="xl" 
              size="md"
              style={{ cursor: 'pointer' }}
            />
          </Menu.Target>

          <Menu.Dropdown className={inter.className}>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item
              leftSection={<IconUser style={{ width: 14, height: 14 }} />}
            >
              Profile
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: 14, height: 14 }} />}
              onClick={handleSignOut}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Stack>
  );
} 