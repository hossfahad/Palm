import { useState, useCallback, useEffect } from 'react';
import { UserRole, UserStatus } from '@/lib/services/user-service';
import { useToast } from '@/components/ui/use-toast';
import { getFamilyMembers, inviteFamilyMember, updateMemberRole as updateRole, removeFamilyMember } from '@/app/actions/family-members';

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isHeadOfFamily: boolean;
  lastActivity: Date;
  profileImage?: string;
}

interface InviteMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export function useFamilyMembers(familyId: string) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getFamilyMembers(familyId);
      setMembers(data.map(member => ({
        id: member.id,
        firstName: member.firstName || '',
        lastName: member.lastName || '',
        email: member.email,
        role: member.role as UserRole,
        status: member.status as UserStatus,
        isHeadOfFamily: member.isHeadOfFamily,
        lastActivity: member.lastActivity || new Date(),
        profileImage: member.profileImage || undefined,
      })));
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load family members. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [familyId, toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const inviteMember = async (input: InviteMemberInput) => {
    try {
      const data = await inviteFamilyMember({
        ...input,
        familyId,
        invitedBy: 'current-user-id', // TODO: Get from auth context
      });

      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${input.email}`,
      });

      // Add the invited member to the list with pending status
      const newMember: FamilyMember = {
        id: data.id,
        ...input,
        status: UserStatus.PENDING,
        isHeadOfFamily: false,
        lastActivity: new Date(),
      };
      setMembers((prev) => [...prev, newMember]);

      return data;
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMemberRole = async (memberId: string, role: UserRole) => {
    try {
      await updateRole(memberId, role);
      setMembers((prev) =>
        prev.map((member) =>
          member.id === memberId ? { ...member, role } : member
        )
      );

      toast({
        title: 'Role Updated',
        description: 'Member role has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      await removeFamilyMember(memberId);
      setMembers((prev) => prev.filter((member) => member.id !== memberId));

      toast({
        title: 'Member Removed',
        description: 'Family member has been removed successfully.',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    members,
    isLoading,
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
} 