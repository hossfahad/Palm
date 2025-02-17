'use client';

import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import { DashboardHeader } from './dashboard-header';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardBreadcrumbs } from './breadcrumbs';

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <DashboardHeader />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <DashboardNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <DashboardBreadcrumbs />
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 