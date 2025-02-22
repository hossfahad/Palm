'use client';

import { AppShell, Container } from '@mantine/core';

interface AppShellWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

export default function AppShellWrapper({ children, header }: AppShellWrapperProps) {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        {header}
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
} 