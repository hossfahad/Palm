'use client';

import { Container } from '@mantine/core';
import { FamilyMemberList } from '@/components/family/family-member-list';
import { InviteMemberForm } from '@/components/family/invite-member-form';
import { useFamilyMembers } from '@/hooks/use-family-members';

// TODO: Get this from your auth context
const CURRENT_FAMILY_ID = 'current-family-id';

export default function DashboardPage() {
  const {
    members,
    isLoading,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useFamilyMembers(CURRENT_FAMILY_ID);

  return (
    <Container size="xl" py="xl">
      <FamilyMemberList
        members={members}
        onInviteMember={() => {}}
        onUpdateRole={updateMemberRole}
        onRemoveMember={removeMember}
      />
    </Container>
  );
}
