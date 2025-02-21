'use client';

import { Stack, ActionIcon, Tooltip } from '@mantine/core';
import {
  IconHome,
  IconBuildingStore,
  IconSettings,
  IconUsers,
  IconLock,
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
      icon: IconLock, 
      label: 'Access', 
      href: '/dashboard/access',
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

  return (
    <Stack 
      h="100%" 
      py="md" 
      px="xs" 
      style={{
        backgroundColor: 'white',
        width: '4rem',
      }}
    >
      <Stack gap="xl" align="center">
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
                  color="dark"
                >
                  <item.icon size={24} />
                </ActionIcon>
              </Tooltip>
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
} 