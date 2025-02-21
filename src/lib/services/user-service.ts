'use server';

import { eq, desc, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, familyInvitations } from '@/lib/schema';
import type { User, FamilyInvitation } from '@/lib/schema';

export const UserRole = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  ADVISOR: 'ADVISOR',
  CLIENT: 'CLIENT',
  FAMILY_MEMBER: 'FAMILY_MEMBER',
} as const;

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

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

export interface FamilyInvitationInput {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  familyId: string;
  invitedBy: string;
}

export class UserService {
  static async createUser(input: CreateUserInput): Promise<User> {
    const [user] = await db.insert(users).values({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
      familyId: input.familyId,
      isHeadOfFamily: input.isHeadOfFamily || false,
      status: UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return user;
  }

  static async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const [user] = await db.update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return user;
  }

  static async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }

  static async getFamilyMembers(familyId: string): Promise<User[]> {
    return db.select()
      .from(users)
      .where(eq(users.familyId, familyId))
      .orderBy(desc(users.isHeadOfFamily), users.firstName);
  }

  static async createFamilyInvitation(input: FamilyInvitationInput): Promise<FamilyInvitation> {
    const [invitation] = await db.insert(familyInvitations).values({
      email: input.email,
      role: input.role,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      familyId: input.familyId,
      invitedBy: input.invitedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return invitation;
  }

  static async acceptFamilyInvitation(invitationId: string, userId: string): Promise<User> {
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
        status: 'accepted',
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
} 