'use client';

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { UserProvider } from '@/lib/contexts/user-context';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        defaultColorScheme="light"
        theme={{
          primaryColor: 'blue',
          fontFamily: 'Inter, sans-serif',
          components: {
            Button: {
              defaultProps: {
                size: 'md',
              },
            },
          },
        }}
      >
        <Notifications position="top-right" />
        <AuthProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </MantineProvider>
    </QueryClientProvider>
  );
} 