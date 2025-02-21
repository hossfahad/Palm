'use client';

import { useState } from 'react';
import { Container, Stack, Title, Text } from '@mantine/core';
import { FamilyMemberList } from '@/components/family/family-member-list';
import { InviteMemberForm } from '@/components/family/invite-member-form';
import { useFamilyMembers } from '@/hooks/use-family-members';

// TODO: Get this from your auth context
const CURRENT_FAMILY_ID = 'current-family-id';

export default function AccessPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const {
    members,
    isLoading,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useFamilyMembers(CURRENT_FAMILY_ID);

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} fw={600}>Access Management</Title>
          <Text c="dimmed" size="sm">
            Manage family members and their access levels
          </Text>
        </div>

        <FamilyMemberList
          members={members}
          onInviteMember={() => setIsInviteOpen(true)}
          onUpdateRole={updateMemberRole}
          onRemoveMember={removeMember}
        />

        <InviteMemberForm
          open={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          onSubmit={inviteMember}
        />
      </Stack>
    </Container>
  );
} 