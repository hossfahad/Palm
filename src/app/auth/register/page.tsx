'use client';

import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Stack, Text, Anchor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting to sign up user with:', { email, firstName, lastName });
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Auth signup response:', { authData, authError });

      if (authError) {
        throw authError;
      }

      if (!authData.user?.id) {
        throw new Error('No user ID returned from signup');
      }

      notifications.show({
        title: 'Success',
        message: 'Registration successful! Please check your email to confirm your account.',
        color: 'green',
      });

      router.push('/auth/login');
    } catch (error) {
      console.error('Registration error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to register',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} mb="md" ta="center">Create an account</Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              required
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />

            <TextInput
              required
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />

            <TextInput
              required
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <TextInput
              required
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password (min. 6 characters)"
              minLength={6}
            />

            <Button type="submit" loading={isLoading}>
              Register
            </Button>

            <Text c="dimmed" size="sm" ta="center">
              Already have an account?{' '}
              <Anchor component={Link} href="/auth/login" size="sm">
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 