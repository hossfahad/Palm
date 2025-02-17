'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import { DashboardNavbar } from '@/components/layout/dashboard-navbar';
import { StickyHeader } from './sticky-header';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={0}
      styles={{
        navbar: {
          borderRight: '1px solid var(--mantine-color-gray-2)',
          zIndex: 2,
        },
        main: {
          backgroundColor: 'var(--mantine-color-gray-0)',
          paddingLeft: 'calc(80px + var(--mantine-spacing-md))', // navbar width + padding
        },
        header: {
          paddingLeft: 'calc(80px + var(--mantine-spacing-md))', // navbar width + padding
        }
      }}
    >
      <AppShell.Header>
        <StickyHeader />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <DashboardNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 