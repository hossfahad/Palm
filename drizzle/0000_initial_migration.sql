CREATE TABLE IF NOT EXISTS "access" (
  "id" text PRIMARY KEY,
  "can_view" boolean NOT NULL,
  "can_edit" boolean NOT NULL,
  "can_delete" boolean NOT NULL,
  "can_invite" boolean NOT NULL,
  "grant_access" boolean NOT NULL,
  "report_access" boolean NOT NULL,
  "document_access" boolean NOT NULL,
  "role" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "addresses" (
  "id" text PRIMARY KEY,
  "street1" text NOT NULL,
  "street2" text,
  "city" text NOT NULL,
  "state" text NOT NULL,
  "postal_code" text NOT NULL,
  "country" text NOT NULL,
  "type" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "client_preferences" (
  "id" text PRIMARY KEY,
  "communication_frequency" text NOT NULL,
  "reporting_preferences" jsonb NOT NULL,
  "marketing_consent" boolean NOT NULL,
  "language_preference" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "compliance" (
  "id" text PRIMARY KEY,
  "kyc_status" text NOT NULL,
  "kyc_date" timestamp,
  "risk_rating" text,
  "restrictions" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "family_info" (
  "id" text PRIMARY KEY,
  "family_meeting_frequency" text,
  "next_gen_programs" jsonb NOT NULL,
  "family_giving_committee" boolean,
  "education_programs" jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS "clients" (
  "id" text PRIMARY KEY,
  "status" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "phone" text,
  "date_of_birth" timestamp,
  "preferred_name" text,
  "preferred_pronouns" text,
  "advisor_id" text NOT NULL,
  "relationship_start_date" timestamp NOT NULL,
  "firm_client_id" text,
  "secondary_advisors" jsonb NOT NULL,
  "relationship_manager" text,
  "cause_areas" jsonb NOT NULL,
  "preferred_contact_method" text NOT NULL,
  "primary_address_id" text NOT NULL REFERENCES "addresses" ("id"),
  "alternate_address_id" text REFERENCES "addresses" ("id"),
  "preferences_id" text NOT NULL REFERENCES "client_preferences" ("id"),
  "compliance_id" text NOT NULL REFERENCES "compliance" ("id"),
  "access_id" text NOT NULL REFERENCES "access" ("id"),
  "family_info_id" text REFERENCES "family_info" ("id"),
  "documents_id" text REFERENCES "documents" ("id")
);

CREATE TABLE IF NOT EXISTS "documents" (
  "id" text PRIMARY KEY,
  "client_id" text NOT NULL REFERENCES "clients" ("id")
);

CREATE TABLE IF NOT EXISTS "family_members" (
  "id" text PRIMARY KEY,
  "family_info_id" text NOT NULL REFERENCES "family_info" ("id"),
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "email" text,
  "relationship" text NOT NULL,
  "access_level" text
);

CREATE TABLE IF NOT EXISTS "successor_plans" (
  "id" text PRIMARY KEY,
  "family_info_id" text NOT NULL REFERENCES "family_info" ("id"),
  "successor_name" text NOT NULL,
  "relationship" text NOT NULL,
  "notes" text,
  "effective_date" timestamp
);

CREATE TABLE IF NOT EXISTS "daf_accounts" (
  "id" text PRIMARY KEY,
  "client_id" text NOT NULL REFERENCES "clients" ("id"),
  "account_number" text NOT NULL,
  "provider" text NOT NULL,
  "balance" integer,
  "last_updated" timestamp
);

CREATE TABLE IF NOT EXISTS "other_giving_accounts" (
  "id" text PRIMARY KEY,
  "client_id" text NOT NULL REFERENCES "clients" ("id"),
  "type" text NOT NULL,
  "account_number" text,
  "institution" text,
  "balance" integer,
  "last_updated" timestamp
); 