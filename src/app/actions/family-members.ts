'use server';

import { UserService } from '@/lib/services/user-service';
import type { UserRole } from '@/lib/services/user-service';

export async function getFamilyMembers(familyId: string) {
  return UserService.getFamilyMembers(familyId);
}

export async function inviteFamilyMember(data: {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  familyId: string;
  invitedBy: string;
}) {
  return UserService.createFamilyInvitation(data);
}

export async function updateMemberRole(memberId: string, role: UserRole) {
  return UserService.updateUser(memberId, { role });
}

export async function removeFamilyMember(memberId: string) {
  return UserService.updateUser(memberId, { status: 'INACTIVE' });
} 