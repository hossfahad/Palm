import { integer, pgTable, text, timestamp, numeric, uuid, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('client'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: text('role').notNull().default('client'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const causeAreas = pgTable('cause_areas', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dafAccounts = pgTable('daf_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  currentBalance: numeric('current_balance').notNull().default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const grants = pgTable('grants', {
  id: uuid('id').defaultRandom().primaryKey(),
  dafAccountId: uuid('daf_account_id').notNull().references(() => dafAccounts.id),
  amount: numeric('amount').notNull(),
  status: text('status').notNull().default('pending'),
  causeAreaId: uuid('cause_area_id').references(() => causeAreas.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const holdings = pgTable('holdings', {
  id: uuid('id').defaultRandom().primaryKey(),
  dafAccountId: uuid('daf_account_id').notNull().references(() => dafAccounts.id),
  assetType: text('asset_type').notNull(), // 'cash', 'publicEquity', 'fixedIncome', 'alternative'
  amount: numeric('amount').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type CauseArea = typeof causeAreas.$inferSelect;
export type NewCauseArea = typeof causeAreas.$inferInsert;

export type DAFAccount = typeof dafAccounts.$inferSelect;
export type NewDAFAccount = typeof dafAccounts.$inferInsert;

export type Grant = typeof grants.$inferSelect;
export type NewGrant = typeof grants.$inferInsert;

export type Holding = typeof holdings.$inferSelect;
export type NewHolding = typeof holdings.$inferInsert; 