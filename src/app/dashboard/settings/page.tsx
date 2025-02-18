'use client';

import { useState } from 'react';
import {
  Title,
  Tabs,
  Paper,
  Stack,
  Text,
  Group,
  Button,
  Switch,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconBrush,
  IconPalette,
} from '@tabler/icons-react';
import { BrandingSettings } from '@/components/settings/branding-settings';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const handleSaveBranding = async (settings: any) => {
    try {
      const formData = new FormData();
      if (settings.logo) formData.append('logo', settings.logo);
      if (settings.favicon) formData.append('favicon', settings.favicon);
      formData.append('settings', JSON.stringify({
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        organizationName: settings.organizationName,
        useDarkMode: settings.useDarkMode,
      }));

      const response = await fetch('/api/organization/branding', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update branding');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <Stack gap="xl">
      <Title order={2}>Settings</Title>
      
      <Tabs defaultValue="branding">
        <Tabs.List>
          <Tabs.Tab value="branding" leftSection={<IconBrush size={16} />}>
            Branding
          </Tabs.Tab>
          <Tabs.Tab value="theme" leftSection={<IconPalette size={16} />}>
            Theme
          </Tabs.Tab>
        </Tabs.List>

        <Paper p="md" mt="md" radius="md" withBorder>
          <Tabs.Panel value="branding">
            <BrandingSettings onSave={handleSaveBranding} />
          </Tabs.Panel>
          <Tabs.Panel value="theme">
            <Stack gap="md">
              <Text>Theme settings coming soon...</Text>
            </Stack>
          </Tabs.Panel>
        </Paper>
      </Tabs>
    </Stack>
  );
} 