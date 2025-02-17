'use client';

import { useState } from 'react';
import {
  Stack,
  Text,
  Group,
  Button,
  FileButton,
  ColorInput,
  Paper,
  Image,
  Switch,
  TextInput,
  Divider,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Logo } from '@/components/brand/logo';

interface BrandingSettings {
  logo?: File;
  primaryColor: string;
  secondaryColor: string;
  organizationName: string;
  useDarkMode: boolean;
  favicon?: File;
}

interface BrandingSettingsProps {
  initialSettings?: Partial<BrandingSettings>;
  onSave: (settings: BrandingSettings) => Promise<void>;
}

export function BrandingSettings({
  initialSettings,
  onSave,
}: BrandingSettingsProps) {
  const [settings, setSettings] = useState<BrandingSettings>({
    primaryColor: initialSettings?.primaryColor || '#7C8B7D',
    secondaryColor: initialSettings?.secondaryColor || '#A65D57',
    organizationName: initialSettings?.organizationName || 'Palm Philanthropy',
    useDarkMode: initialSettings?.useDarkMode || false,
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const handleLogoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setSettings((prev) => ({ ...prev, logo: file }));
    }
  };

  const handleFaviconChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setSettings((prev) => ({ ...prev, favicon: file }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(settings);
      notifications.show({
        title: 'Settings Saved',
        message: 'Your branding settings have been updated successfully.',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save branding settings.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Customize your organization's branding and appearance
      </Text>

      <Paper p="md" withBorder>
        <Stack gap="md">
          <Text size="sm" fw={500}>
            Logo
          </Text>

          <Group align="flex-start">
            <Paper
              p="lg"
              withBorder
              style={{
                width: 200,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Organization logo"
                  fit="contain"
                  w={160}
                  h={80}
                />
              ) : (
                <Logo size="md" color={settings.primaryColor} />
              )}
            </Paper>

            <Stack gap="xs">
              <FileButton
                onChange={handleLogoChange}
                accept="image/png,image/jpeg,image/svg+xml"
              >
                {(props) => (
                  <Button variant="light" size="sm" {...props}>
                    Upload Logo
                  </Button>
                )}
              </FileButton>
              <Text size="xs" c="dimmed">
                Recommended size: 160x80px
                <br />
                Supported formats: PNG, JPG, SVG
                <br />
                Maximum size: 2MB
              </Text>
            </Stack>
          </Group>

          <Divider my="sm" />

          <Text size="sm" fw={500}>
            Colors
          </Text>

          <Group grow>
            <ColorInput
              label="Primary Color"
              value={settings.primaryColor}
              onChange={(color) =>
                setSettings((prev) => ({ ...prev, primaryColor: color }))
              }
            />
            <ColorInput
              label="Secondary Color"
              value={settings.secondaryColor}
              onChange={(color) =>
                setSettings((prev) => ({ ...prev, secondaryColor: color }))
              }
            />
          </Group>

          <Divider my="sm" />

          <Text size="sm" fw={500}>
            Organization Details
          </Text>

          <TextInput
            label="Organization Name"
            value={settings.organizationName}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                organizationName: e.target.value,
              }))
            }
          />

          <Group align="flex-start">
            <Paper
              p="md"
              withBorder
              style={{
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {faviconPreview ? (
                <Image
                  src={faviconPreview}
                  alt="Favicon"
                  fit="contain"
                  w={32}
                  h={32}
                />
              ) : (
                <Logo size="sm" color={settings.primaryColor} />
              )}
            </Paper>

            <Stack gap="xs">
              <FileButton
                onChange={handleFaviconChange}
                accept="image/png,image/x-icon"
              >
                {(props) => (
                  <Button variant="light" size="sm" {...props}>
                    Upload Favicon
                  </Button>
                )}
              </FileButton>
              <Text size="xs" c="dimmed">
                Recommended size: 32x32px
                <br />
                Supported formats: PNG, ICO
                <br />
                Maximum size: 100KB
              </Text>
            </Stack>
          </Group>

          <Divider my="sm" />

          <Text size="sm" fw={500}>
            Theme
          </Text>

          <Switch
            label="Enable Dark Mode"
            description="Use dark color scheme across the platform"
            checked={settings.useDarkMode}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                useDarkMode: e.currentTarget.checked,
              }))
            }
          />
        </Stack>
      </Paper>

      <Group justify="flex-end">
        <Button variant="light" onClick={() => window.location.reload()}>
          Reset Changes
        </Button>
        <Button loading={loading} onClick={handleSave}>
          Save Changes
        </Button>
      </Group>
    </Stack>
  );
} 