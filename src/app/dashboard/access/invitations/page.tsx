'use client';

import { Container, Stack, Title, Text, Paper, Group, Badge } from '@mantine/core';
import { useFamilyMembers } from '@/hooks/use-family-members';

// TODO: Get this from your auth context
const CURRENT_FAMILY_ID = 'current-family-id';

export default function InvitationsPage() {
  const { members } = useFamilyMembers(CURRENT_FAMILY_ID);
  const pendingMembers = members.filter(member => member.status === 'PENDING');

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} fw={600}>Pending Invitations</Title>
          <Text c="dimmed" size="sm">
            Track and manage pending family member invitations
          </Text>
        </div>

        {pendingMembers.length === 0 ? (
          <Paper p="xl" radius="md" withBorder>
            <Text c="dimmed">No pending invitations</Text>
          </Paper>
        ) : (
          <Stack gap="md">
            {pendingMembers.map((member) => (
              <Paper key={member.id} p="md" radius="md" withBorder>
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>
                      {member.firstName} {member.lastName}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {member.email}
                    </Text>
                  </div>
                  <Group>
                    <Badge color="yellow">Pending</Badge>
                    <Badge color="blue">{member.role}</Badge>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
} 