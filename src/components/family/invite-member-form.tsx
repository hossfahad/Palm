'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import {
  Modal,
  TextInput,
  Button,
  Stack,
  Title,
  Text,
  Select,
} from '@mantine/core';
import { UserRole } from '@/lib/services/user-service';

const inviteFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['FAMILY_MEMBER', 'CLIENT']),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

interface InviteMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InviteFormValues) => Promise<void>;
}

export function InviteMemberForm({
  open,
  onClose,
  onSubmit,
}: InviteMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'FAMILY_MEMBER',
    },
  });

  const handleSubmit = async (values: InviteFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error inviting member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={<Title order={3}>Invite Family Member</Title>}
      size="md"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Send an invitation to add a new family member to your account.
          </Text>

          <TextInput
            label="First Name"
            placeholder="John"
            error={form.formState.errors.firstName?.message}
            {...form.register('firstName')}
          />

          <TextInput
            label="Last Name"
            placeholder="Doe"
            error={form.formState.errors.lastName?.message}
            {...form.register('lastName')}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            error={form.formState.errors.email?.message}
            {...form.register('email')}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <Select
                label="Role"
                placeholder="Select a role"
                data={[
                  { value: 'FAMILY_MEMBER', label: 'Family Member' },
                  { value: 'CLIENT', label: 'Client' },
                ]}
                error={form.formState.errors.role?.message}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Stack gap="sm" align="flex-end">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!form.formState.isValid}
              fullWidth
            >
              {isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
} 