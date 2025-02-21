import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, familyInvitations, userRoles, userStatuses, invitationStatuses } from '@/lib/schema';

export type UserRole = (typeof userRoles)[number];
export type UserStatus = (typeof userStatuses)[number];
export type InvitationStatus = (typeof invitationStatuses)[number];

export const UserRole = {
  FAMILY_MEMBER: 'FAMILY_MEMBER' as UserRole,
  CLIENT: 'CLIENT' as UserRole,
} as const;

export const UserStatus = {
  ACTIVE: 'ACTIVE' as UserStatus,
  PENDING: 'PENDING' as UserStatus,
  INACTIVE: 'INACTIVE' as UserStatus,
} as const;

export type CreateUserInput = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  familyId?: string;
  isHeadOfFamily?: boolean;
};

export type UpdateUserInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isHeadOfFamily: boolean;
}>;

export type FamilyInvitationInput = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  familyId: string;
  invitedBy: string;
};

export async function createUser(input: CreateUserInput) {
  const [user] = await db.insert(users).values({
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role,
    familyId: input.familyId!,
    isHeadOfFamily: input.isHeadOfFamily || false,
    status: UserStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  return user;
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const [user] = await db.update(users)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning();

  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user || null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user || null;
}

export async function getFamilyMembers(familyId: string) {
  return db.select()
    .from(users)
    .where(eq(users.familyId, familyId))
    .orderBy(desc(users.isHeadOfFamily), users.firstName);
}

export async function createFamilyInvitation(input: FamilyInvitationInput) {
  const [invitation] = await db.insert(familyInvitations).values({
    email: input.email,
    role: input.role,
    status: 'pending' as InvitationStatus,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    familyId: input.familyId,
    invitedBy: input.invitedBy,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();

  return invitation;
}

export async function acceptFamilyInvitation(invitationId: string, userId: string) {
  const [invitation] = await db.select()
    .from(familyInvitations)
    .where(eq(familyInvitations.id, invitationId))
    .limit(1);

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.status !== 'pending') {
    throw new Error('Invitation is no longer valid');
  }

  if (invitation.expiresAt < new Date()) {
    throw new Error('Invitation has expired');
  }

  // Update the invitation status
  await db.update(familyInvitations)
    .set({ 
      status: 'accepted' as InvitationStatus,
      updatedAt: new Date(),
    })
    .where(eq(familyInvitations.id, invitationId));

  // Update the user's family membership
  const [updatedUser] = await db.update(users)
    .set({
      familyId: invitation.familyId,
      role: invitation.role,
      status: UserStatus.ACTIVE,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
} 