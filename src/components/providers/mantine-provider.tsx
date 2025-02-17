'use client';

import { MantineProvider as BaseMantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Spotlight, SpotlightProvider } from '@mantine/spotlight';
import { ReactNode } from 'react';
import { theme } from '@/lib/theme';
import { spotlightActions } from '@/lib/spotlight/actions';

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <SpotlightProvider
          actions={spotlightActions}
          shortcut={['mod + K']}
          searchPlaceholder="Search actions..."
          highlightQuery
          limit={7}
          searchProps={{
            leftSection: '⌘K',
            size: 'md',
          }}
        >
          <Notifications position="top-right" />
          {children}
        </SpotlightProvider>
      </ModalsProvider>
    </BaseMantineProvider>
  );
} 