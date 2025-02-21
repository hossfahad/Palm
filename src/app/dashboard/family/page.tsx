'use client';

import { useState, useEffect } from 'react';
import { Container } from '@mantine/core';
import { FamilyMemberList } from '@/components/family/family-member-list';
import { InviteMemberForm } from '@/components/family/invite-member-form';
import { useFamilyMembers } from '@/hooks/use-family-members';

// TODO: Get this from your auth context
const CURRENT_FAMILY_ID = 'current-family-id';

export default function FamilyPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const {
    members,
    isLoading,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useFamilyMembers(CURRENT_FAMILY_ID);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <Container size="xl" py="xl">
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
    </Container>
  );
} 