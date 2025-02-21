CREATE TABLE "access" (
	"id" text PRIMARY KEY NOT NULL,
	"can_view" boolean NOT NULL,
	"can_edit" boolean NOT NULL,
	"can_delete" boolean NOT NULL,
	"can_invite" boolean NOT NULL,
	"grant_access" boolean NOT NULL,
	"report_access" boolean NOT NULL,
	"document_access" boolean NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"street1" text NOT NULL,
	"street2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postal_code" text NOT NULL,
	"country" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"communication_frequency" text NOT NULL,
	"reporting_preferences" jsonb NOT NULL,
	"marketing_consent" boolean NOT NULL,
	"language_preference" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
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
	"primary_address_id" text NOT NULL,
	"alternate_address_id" text,
	"preferences_id" text NOT NULL,
	"compliance_id" text NOT NULL,
	"access_id" text NOT NULL,
	"family_info_id" text,
	"documents_id" text,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "compliance" (
	"id" text PRIMARY KEY NOT NULL,
	"kyc_status" text NOT NULL,
	"kyc_date" timestamp,
	"risk_rating" text,
	"restrictions" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daf_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"account_number" text NOT NULL,
	"provider" text NOT NULL,
	"balance" integer,
	"last_updated" timestamp
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_info" (
	"id" text PRIMARY KEY NOT NULL,
	"family_meeting_frequency" text,
	"next_gen_programs" jsonb NOT NULL,
	"family_giving_committee" boolean,
	"education_programs" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "family_members" (
	"id" text PRIMARY KEY NOT NULL,
	"family_info_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"relationship" text NOT NULL,
	"access_level" text
);
--> statement-breakpoint
CREATE TABLE "other_giving_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" text NOT NULL,
	"type" text NOT NULL,
	"account_number" text,
	"institution" text,
	"balance" integer,
	"last_updated" timestamp
);
--> statement-breakpoint
CREATE TABLE "successor_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"family_info_id" text NOT NULL,
	"successor_name" text NOT NULL,
	"relationship" text NOT NULL,
	"notes" text,
	"effective_date" timestamp
);
--> statement-breakpoint
DROP TABLE "Family" CASCADE;--> statement-breakpoint
DROP TABLE "FamilyInvitation" CASCADE;--> statement-breakpoint
DROP TABLE "User" CASCADE;