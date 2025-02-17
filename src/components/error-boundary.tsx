'use client';

import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useEffect } from 'react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <Container size="md" py="xl">
      <Stack align="center" gap="xl">
        <Stack align="center" gap="md">
          <Title order={1}>Something went wrong!</Title>
          <Text c="dimmed" size="lg" ta="center">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </Text>
        </Stack>

        <Group>
          <Button variant="light" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
          <Button onClick={() => reset()}>Try again</Button>
        </Group>

        {process.env.NODE_ENV === 'development' && (
          <Text size="sm" ta="center" style={{ maxWidth: '600px' }}>
            <Text span fw={500}>Error details:</Text> {error.message}
          </Text>
        )}
      </Stack>
    </Container>
  );
} 