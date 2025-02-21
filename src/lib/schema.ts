import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const userRoles = ['FAMILY_MEMBER', 'CLIENT'] as const;
export const userStatuses = ['ACTIVE', 'PENDING', 'INACTIVE'] as const;
export const invitationStatuses = ['pending', 'accepted', 'rejected'] as const;

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role', { enum: userRoles }).notNull(),
  status: text('status', { enum: userStatuses }).notNull(),
  familyId: uuid('family_id').notNull(),
  isHeadOfFamily: boolean('is_head_of_family').default(false),
  profileImage: text('profile_image'),
  lastActivity: timestamp('last_activity'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const families = pgTable('families', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  status: text('status', { enum: userStatuses }).notNull(),
  advisorId: uuid('advisor_id').notNull(),
  preferredContactMethod: text('preferred_contact_method').notNull(),
  relationshipStartDate: timestamp('relationship_start_date').notNull(),
  secondaryAdvisors: text('secondary_advisors').array(),
  causeAreas: text('cause_areas').array(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const familyInvitations = pgTable('family_invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: text('role', { enum: userRoles }).notNull(),
  status: text('status', { enum: invitationStatuses }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  familyId: uuid('family_id').notNull(),
  invitedBy: uuid('invited_by').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}); 