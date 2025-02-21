'use client';

import { Container, Stack, Title, Text, Paper, Switch, Group } from '@mantine/core';

export default function AccessSettingsPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} fw={600}>Access Settings</Title>
          <Text c="dimmed" size="sm">
            Configure family access settings and permissions
          </Text>
        </div>

        <Paper p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div>
              <Text fw={500}>Invitation Settings</Text>
              <Text size="sm" c="dimmed">
                Configure how family member invitations work
              </Text>
            </div>

            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text size="sm">Require Approval</Text>
                  <Text size="xs" c="dimmed">
                    New members must be approved before joining
                  </Text>
                </div>
                <Switch defaultChecked />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text size="sm">Auto-expire Invitations</Text>
                  <Text size="xs" c="dimmed">
                    Invitations expire after 7 days
                  </Text>
                </div>
                <Switch defaultChecked />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text size="sm">Allow Member Invitations</Text>
                  <Text size="xs" c="dimmed">
                    Let family members invite others
                  </Text>
                </div>
                <Switch />
              </Group>
            </Stack>
          </Stack>
        </Paper>

        <Paper p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <div>
              <Text fw={500}>Default Permissions</Text>
              <Text size="sm" c="dimmed">
                Set default permissions for new family members
              </Text>
            </div>

            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text size="sm">View Donations</Text>
                  <Text size="xs" c="dimmed">
                    Can view family donation history
                  </Text>
                </div>
                <Switch defaultChecked />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text size="sm">View Grants</Text>
                  <Text size="xs" c="dimmed">
                    Can view family grant history
                  </Text>
                </div>
                <Switch defaultChecked />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text size="sm">Make Recommendations</Text>
                  <Text size="xs" c="dimmed">
                    Can recommend grants and donations
                  </Text>
                </div>
                <Switch />
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
} 