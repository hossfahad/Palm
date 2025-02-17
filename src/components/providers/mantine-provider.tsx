'use client';

import { MantineProvider as BaseMantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { SpotlightProvider } from '@mantine/spotlight';
import { ReactNode } from 'react';
import { theme } from '@/lib/theme';

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <SpotlightProvider actions={[]} shortcut={['mod + K']}>
          <Notifications />
          {children}
        </SpotlightProvider>
      </ModalsProvider>
    </BaseMantineProvider>
  );
} 