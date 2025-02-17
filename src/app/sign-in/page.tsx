'use client';

import { Button, Card, Container, Stack, Text, Title } from '@mantine/core';
import { signIn } from 'next-auth/react';
import { IconBrandGoogle } from '@tabler/icons-react';

export default function SignInPage() {
  return (
    <Container size="xs" py="xl">
      <Card shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="lg">
          <Stack gap="md" ta="center">
            <Title order={1} size="h2">Welcome Back</Title>
            <Text c="dimmed">Sign in to access your dashboard</Text>
          </Stack>

          <Button
            size="lg"
            variant="light"
            leftSection={<IconBrandGoogle size={20} />}
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          >
            Continue with Google
          </Button>
        </Stack>
      </Card>
    </Container>
  );
} 