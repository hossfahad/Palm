'use client';

import { useState } from 'react';
import {
  Card,
  TextInput,
  Select,
  NumberInput,
  Stack,
  Button,
  Group,
  FileInput,
  Text,
  Divider,
  PasswordInput,
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

interface UserProfile {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [orgProfile, setOrgProfile] = useState<OrganizationProfile>({
    name: '',
    type: '',
    aum: 0,
    email: '',
    phone: '',
    secNumber: '',
    crdNumber: '',
    logo: null,
  });

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const organizationTypes = [
    'Family Office',
    'RIA',
    'Broker-Dealer',
    'Bank',
  ];

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save organization profile
      notifications.show({
        title: 'Success',
        message: 'Organization profile updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update organization profile',
        color: 'red',
      });
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to save user profile
      notifications.show({
        title: 'Success',
        message: 'User profile updated successfully',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update user profile',
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="xl">
      <PageHeader title="Profile Settings" />

      <form onSubmit={handleUserSubmit}>
        <Card withBorder>
          <Stack gap="md">
            <Text fw={500} size="lg">Personal Information</Text>
            
            <Group grow>
              <TextInput
                label="Full Name"
                required
                value={userProfile.name}
                onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              />
              <TextInput
                label="Email"
                required
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              />
            </Group>

            <Divider />

            <Text fw={500} size="lg">Change Password</Text>

            <PasswordInput
              label="Current Password"
              value={userProfile.currentPassword}
              onChange={(e) => setUserProfile({ ...userProfile, currentPassword: e.target.value })}
            />

            <Group grow>
              <PasswordInput
                label="New Password"
                value={userProfile.newPassword}
                onChange={(e) => setUserProfile({ ...userProfile, newPassword: e.target.value })}
              />
              <PasswordInput
                label="Confirm New Password"
                value={userProfile.confirmPassword}
                onChange={(e) => setUserProfile({ ...userProfile, confirmPassword: e.target.value })}
              />
            </Group>

            <Group justify="flex-end">
              <Button type="submit" color="sage">Save Changes</Button>
            </Group>
          </Stack>
        </Card>
      </form>

      <form onSubmit={handleOrgSubmit}>
        <Card withBorder>
          <Stack gap="md">
            <Text fw={500} size="lg">Organization Settings</Text>

            <Group grow>
              <TextInput
                label="Organization Name"
                required
                value={orgProfile.name}
                onChange={(e) => setOrgProfile({ ...orgProfile, name: e.target.value })}
              />
              <Select
                label="Organization Type"
                required
                data={organizationTypes}
                value={orgProfile.type}
                onChange={(value) => setOrgProfile({ ...orgProfile, type: value || '' })}
              />
            </Group>

            <NumberInput
              label="Assets Under Management (AUM)"
              required
              min={0}
              step={1000000}
              prefix="$"
              value={orgProfile.aum}
              onChange={(value) => setOrgProfile({ ...orgProfile, aum: Number(value) || 0 })}
            />

            <Group grow>
              <TextInput
                label="Email"
                required
                type="email"
                value={orgProfile.email}
                onChange={(e) => setOrgProfile({ ...orgProfile, email: e.target.value })}
              />
              <TextInput
                label="Phone"
                value={orgProfile.phone}
                onChange={(e) => setOrgProfile({ ...orgProfile, phone: e.target.value })}
              />
            </Group>

            <Group grow>
              <TextInput
                label="SEC Number"
                value={orgProfile.secNumber}
                onChange={(e) => setOrgProfile({ ...orgProfile, secNumber: e.target.value })}
              />
              <TextInput
                label="CRD Number"
                value={orgProfile.crdNumber}
                onChange={(e) => setOrgProfile({ ...orgProfile, crdNumber: e.target.value })}
              />
            </Group>

            <Stack gap="xs">
              <Text size="sm" fw={500}>Organization Logo</Text>
              <FileInput
                placeholder="Upload logo"
                accept="image/*"
                leftSection={<IconUpload size={16} />}
                value={orgProfile.logo}
                onChange={(file) => setOrgProfile({ ...orgProfile, logo: file })}
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