'use client';

import { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Stack, Select, MultiSelect } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Client, useClients } from '@/hooks/use-clients';

interface EditClientModalProps {
  client: Client | null;
  opened: boolean;
  onClose: () => void;
}

export function EditClientModal({ client, opened, onClose }: EditClientModalProps) {
  const { updateClient, isUpdating } = useClients();
  const [formData, setFormData] = useState<Partial<Client>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredName: '',
    preferredPronouns: '',
    preferredContactMethod: 'email',
    status: 'ACTIVE',
    timeZone: '',
    causeAreas: [],
  });

  // Update form data when client changes
  useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone || '',
        preferredName: client.preferredName || '',
        preferredPronouns: client.preferredPronouns || '',
        preferredContactMethod: client.preferredContactMethod,
        status: client.status,
        timeZone: client.timeZone || '',
        causeAreas: client.causeAreas || [],
      });
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client?.id) return;

    try {
      await updateClient({
        id: client.id,
        data: formData,
      });

      notifications.show({
        title: 'Success',
        message: 'Client updated successfully',
        color: 'green',
      });

      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update client',
        color: 'red',
      });
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Edit Client"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />

          <TextInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />

          <TextInput
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />

          <TextInput
            label="Preferred Name"
            value={formData.preferredName}
            onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
          />

          <TextInput
            label="Preferred Pronouns"
            value={formData.preferredPronouns}
            onChange={(e) => setFormData(prev => ({ ...prev, preferredPronouns: e.target.value }))}
          />

          <Select
            label="Preferred Contact Method"
            value={formData.preferredContactMethod}
            onChange={(value) => setFormData(prev => ({ ...prev, preferredContactMethod: value as 'email' | 'phone' | 'mail' }))}
            data={[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'mail', label: 'Mail' },
            ]}
            required
          />

          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value as Client['status'] }))}
            data={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
            required
          />

          <TextInput
            label="Time Zone"
            value={formData.timeZone}
            onChange={(e) => setFormData(prev => ({ ...prev, timeZone: e.target.value }))}
            placeholder="e.g., America/New_York"
          />

          <MultiSelect
            label="Cause Areas"
            value={formData.causeAreas}
            onChange={(value) => setFormData(prev => ({ ...prev, causeAreas: value }))}
            data={[
              { value: 'education', label: 'Education' },
              { value: 'health', label: 'Health' },
              { value: 'environment', label: 'Environment' },
              { value: 'social-justice', label: 'Social Justice' },
              { value: 'arts-culture', label: 'Arts & Culture' },
              { value: 'poverty', label: 'Poverty Alleviation' },
            ]}
            searchable
            clearable
          />

          <Button type="submit" loading={isUpdating}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Modal>
  );
} 