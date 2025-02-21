'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export type FamilyMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'FAMILY_MEMBER' | 'CLIENT';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  isHeadOfFamily: boolean;
  lastActivity?: Date;
  profileImage?: string;
};

export function useFamilyMembers(familyId: string) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/family/${familyId}/members`);
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load family members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [familyId, toast]);

  const inviteMember = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'FAMILY_MEMBER' | 'CLIENT';
  }) => {
    try {
      const response = await fetch('/api/family/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, familyId }),
      });

      if (!response.ok) throw new Error('Failed to send invitation');

      toast({
        title: 'Success',
        description: 'Invitation sent successfully',
      });

      // Add the invited member to the list with pending status
      setMembers(prev => [...prev, {
        id: 'temp-' + Date.now(),
        ...data,
        status: 'PENDING',
        isHeadOfFamily: false,
      }]);
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMemberRole = async (memberId: string, role: 'FAMILY_MEMBER' | 'CLIENT') => {
    try {
      const response = await fetch(`/api/family/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      setMembers(prev =>
        prev.map(member =>
          member.id === memberId ? { ...member, role } : member
        )
      );

      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/family/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove member');

      setMembers(prev => prev.filter(member => member.id !== memberId));

      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
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