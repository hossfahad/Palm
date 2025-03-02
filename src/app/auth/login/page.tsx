'use client';

import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Stack, Text, Anchor, Alert, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { IconAlertCircle } from '@tabler/icons-react';
import { Logo } from '@/components/brand/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const error = searchParams.get('error');
  const supabase = createClient();

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      notifications.show({
        title: 'Success',
        message: 'Confirmation email has been resent. Please check your inbox.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to resend confirmation email',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          notifications.show({
            title: 'Email Not Confirmed',
            message: 'Please check your email for the confirmation link or click below to resend it.',
            color: 'yellow',
          });
          setIsLoading(false);
          return;
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error('No user returned from login');
      }

      console.log('Auth successful, fetching user profile...');
      // Get user profile to determine role and ID
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, id')
        .eq('user_id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        console.error('No profile found for user:', data.user.id);
        throw new Error('User profile not found');
      }

      console.log('Profile found:', profile);
      console.log('User role:', profile.role);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green',
      });

      // Redirect based on user role
      const redirectPath = profile.role === 'advisor' 
        ? `/advisor/${profile.id}/dashboard`
        : profile.role === 'client'
          ? `/client/${profile.id}/dashboard`
          : '/dashboard';

      router.replace(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to sign in',
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" py="xl">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" mb="xl">
          <Logo size="lg" />
        </Stack>

        <Title order={2} mb="md" ta="center">Welcome back</Title>

        {error === 'auth_callback_failed' && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
            There was a problem confirming your email. Please try registering again.
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack>
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
              placeholder="Your password"
            />

            <Button type="submit" loading={isLoading}>
              Sign in
            </Button>

            <Button 
              variant="subtle" 
              onClick={handleResendConfirmation}
              disabled={!email}
            >
              Resend confirmation email
            </Button>

            <Text c="dimmed" size="sm" ta="center">
              Don&apos;t have an account?{' '}
              <Anchor component={Link} href="/auth/register" size="sm">
                Register
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
} 