'use client';

import { AppShell } from '@mantine/core';
import { DashboardNavbar } from './dashboard-navbar';
import { StickyHeader } from './sticky-header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: { base: 64 },
        breakpoint: 'sm',
        collapsed: { mobile: false }
      }}
      styles={{
        main: {
          background: 'var(--mantine-color-gray-0)',
        },
        navbar: {
          backgroundColor: 'white',
          borderRight: '1px solid var(--mantine-color-gray-2)',
          width: '4rem !important',
        },
        header: {
          backgroundColor: 'white',
          borderBottom: '1px solid var(--mantine-color-gray-2)',
        }
      }}
    >
      <AppShell.Header>
        <StickyHeader />
      </AppShell.Header>

      <AppShell.Navbar>
        <DashboardNavbar />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 