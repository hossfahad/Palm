'use client';

import { useState } from 'react';
import {
  Card,
  TextInput,
  Select,
  NumberInput,
  Stack,
  Button,
  Title,
  Text,
  Group,
  FileInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { PageHeader } from '@/components/layout/page-header';

interface OrganizationProfile {
  name: string;
  type: string;
  aum: number;
  email: string;
  phone: string;
  secNumber: string;
  crdNumber: string;
  logo: File | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<OrganizationProfile>({
    name: '',
    type: '',
    aum: 0,
    email: '',
    phone: '',
    secNumber: '',
    crdNumber: '',
    logo: null,
  });

  const organizationTypes = [
    'Family Office',
    'RIA',
    'Broker-Dealer',
    'Bank',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save profile
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xl">
      <PageHeader title="Organization Profile" />

      <form onSubmit={handleSubmit}>
        <Card withBorder>
          <Stack gap="md">
            <Group grow>
              <TextInput
                label="Organization Name"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
              <Select
                label="Organization Type"
                required
                data={organizationTypes}
                value={profile.type}
                onChange={(value) => setProfile({ ...profile, type: value || '' })}
              />
            </Group>

            <NumberInput
              label="Assets Under Management (AUM)"
              required
              min={0}
              step={1000000}
              prefix="$"
              value={profile.aum}
              onChange={(value) => setProfile({ ...profile, aum: Number(value) || 0 })}
            />

            <Group grow>
              <TextInput
                label="Email"
                required
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <TextInput
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </Group>

            <Group grow>
              <TextInput
                label="SEC Number"
                value={profile.secNumber}
                onChange={(e) => setProfile({ ...profile, secNumber: e.target.value })}
              />
              <TextInput
                label="CRD Number"
                value={profile.crdNumber}
                onChange={(e) => setProfile({ ...profile, crdNumber: e.target.value })}
              />
            </Group>

            <Stack gap="xs">
              <Text size="sm" fw={500}>Organization Logo</Text>
              <FileInput
                placeholder="Upload logo"
                accept="image/*"
                leftSection={<IconUpload size={16} />}
                value={profile.logo}
                onChange={(file) => setProfile({ ...profile, logo: file })}
              />
            </Stack>

            <Group justify="flex-end">
              <Button type="submit" color="sage">Save Changes</Button>
            </Group>
          </Stack>
        </Card>
      </form>
    </Stack>
  );
} 