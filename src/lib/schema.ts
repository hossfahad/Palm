import { pgTable, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import type { InferSelectModel } from 'drizzle-orm';

// Enums
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

export const KycStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const DocumentType = {
  AGREEMENT: 'AGREEMENT',
  TAX: 'TAX',
  GRANT_LETTER: 'GRANT_LETTER',
  CORRESPONDENCE: 'CORRESPONDENCE',
} as const;

export const AddressType = {
  HOME: 'home',
  BUSINESS: 'business',
  MAILING: 'mailing',
} as const;

// Tables
export const clients = pgTable('clients', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  status: text('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  dateOfBirth: timestamp('date_of_birth'),
  preferredName: text('preferred_name'),
  preferredPronouns: text('preferred_pronouns'),
  advisorId: text('advisor_id').notNull(),
  relationshipStartDate: timestamp('relationship_start_date').notNull(),
  firmClientId: text('firm_client_id'),
  secondaryAdvisors: jsonb('secondary_advisors').notNull().$type<string[]>(),
  relationshipManager: text('relationship_manager'),
  causeAreas: jsonb('cause_areas').notNull().$type<string[]>(),
  preferredContactMethod: text('preferred_contact_method').notNull(),
  primaryAddressId: text('primary_address_id').notNull(),
  alternateAddressId: text('alternate_address_id'),
  preferencesId: text('preferences_id').notNull(),
  complianceId: text('compliance_id').notNull(),
  accessId: text('access_id').notNull(),
  familyInfoId: text('family_info_id'),
  documentsId: text('documents_id'),
});

export const clientPreferences = pgTable('client_preferences', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  communicationFrequency: text('communication_frequency').notNull(),
  reportingPreferences: jsonb('reporting_preferences').notNull().$type<string[]>(),
  marketingConsent: boolean('marketing_consent').notNull(),
  languagePreference: text('language_preference').notNull(),
});

export const compliance = pgTable('compliance', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  kycStatus: text('kyc_status').notNull(),
  kycDate: timestamp('kyc_date'),
  riskRating: text('risk_rating'),
  restrictions: jsonb('restrictions').notNull().$type<string[]>(),
});

export const access = pgTable('access', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  canView: boolean('can_view').notNull(),
  canEdit: boolean('can_edit').notNull(),
  canDelete: boolean('can_delete').notNull(),
  canInvite: boolean('can_invite').notNull(),
  grantAccess: boolean('grant_access').notNull(),
  reportAccess: boolean('report_access').notNull(),
  documentAccess: boolean('document_access').notNull(),
  role: text('role').notNull(),
});

export const addresses = pgTable('addresses', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  street1: text('street1').notNull(),
  street2: text('street2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  postalCode: text('postal_code').notNull(),
  country: text('country').notNull(),
  type: text('type').notNull(),
});

export const familyInfo = pgTable('family_info', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  familyMeetingFrequency: text('family_meeting_frequency'),
  nextGenPrograms: jsonb('next_gen_programs').notNull().$type<string[]>(),
  familyGivingCommittee: boolean('family_giving_committee'),
  educationPrograms: jsonb('education_programs').notNull().$type<string[]>(),
});

export const documents = pgTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clientId: text('client_id').notNull(),
});

export const familyMembers = pgTable('family_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  familyInfoId: text('family_info_id').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email'),
  relationship: text('relationship').notNull(),
  accessLevel: text('access_level'),
});

export const successorPlans = pgTable('successor_plans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  familyInfoId: text('family_info_id').notNull(),
  successorName: text('successor_name').notNull(),
  relationship: text('relationship').notNull(),
  notes: text('notes'),
  effectiveDate: timestamp('effective_date'),
});

export const dafAccounts = pgTable('daf_accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clientId: text('client_id').notNull(),
  accountNumber: text('account_number').notNull(),
  provider: text('provider').notNull(),
  balance: integer('balance'),
  lastUpdated: timestamp('last_updated'),
});

export const otherGivingAccounts = pgTable('other_giving_accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  clientId: text('client_id').notNull(),
  type: text('type').notNull(),
  accountNumber: text('account_number'),
  institution: text('institution'),
  balance: integer('balance'),
  lastUpdated: timestamp('last_updated'),
});

// Add User-related tables
export const families = pgTable('families', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  givingPhilosophy: text('giving_philosophy'),
  missionStatement: text('mission_statement'),
  values: jsonb('values').notNull().$type<string[]>(),
  meetingFrequency: text('meeting_frequency'),
  communicationPrefs: text('communication_prefs'),
  lastActivity: timestamp('last_activity'),
});

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').notNull().default('CLIENT'),
  status: text('status').notNull().default('PENDING'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  dateOfBirth: timestamp('date_of_birth'),
  phone: text('phone'),
  profileImage: text('profile_image'),
  familyId: text('family_id').references(() => families.id),
  isHeadOfFamily: boolean('is_head_of_family').notNull().default(false),
  parentId: text('parent_id'),
  permissions: jsonb('permissions'),
  lastLogin: timestamp('last_login'),
  lastActivity: timestamp('last_activity'),
});

export const familyInvitations = pgTable('family_invitations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull(),
  role: text('role').notNull(),
  status: text('status').notNull().default('pending'),
  expiresAt: timestamp('expires_at').notNull(),
  familyId: text('family_id').notNull().references(() => families.id),
  invitedBy: text('invited_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userAccessLogs = pgTable('user_access_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id),
  action: text('action').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// Types
export type Client = typeof clients.$inferSelect;
export type ClientPreferences = typeof clientPreferences.$inferSelect;
export type Compliance = typeof compliance.$inferSelect;
export type Access = typeof access.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type FamilyInfo = typeof familyInfo.$inferSelect;
export type Documents = typeof documents.$inferSelect;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type SuccessorPlan = typeof successorPlans.$inferSelect;
export type DAFAccount = typeof dafAccounts.$inferSelect;
export type OtherGivingAccount = typeof otherGivingAccounts.$inferSelect;

// Add User-related types
export type Family = InferSelectModel<typeof families>;
export type User = InferSelectModel<typeof users>;
export type FamilyInvitation = typeof familyInvitations.$inferSelect;
export type UserAccessLog = typeof userAccessLogs.$inferSelect; 