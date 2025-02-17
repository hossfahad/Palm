'use client';

import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Center h="100%" py="xl">
      <Stack align="center" gap="sm">
        <Loader size="md" />
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      </Stack>
    </Center>
  );
} 