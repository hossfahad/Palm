CREATE TABLE IF NOT EXISTS "families" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "giving_philosophy" text,
  "mission_statement" text,
  "values" jsonb NOT NULL,
  "meeting_frequency" text,
  "communication_prefs" text,
  "last_activity" timestamp
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL UNIQUE,
  "name" text,
  "role" text NOT NULL DEFAULT 'CLIENT',
  "status" text NOT NULL DEFAULT 'PENDING',
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now(),
  "first_name" text,
  "last_name" text,
  "date_of_birth" timestamp,
  "phone" text,
  "profile_image" text,
  "family_id" text REFERENCES "families" ("id"),
  "is_head_of_family" boolean NOT NULL DEFAULT false,
  "parent_id" text REFERENCES "users" ("id"),
  "permissions" jsonb,
  "last_login" timestamp,
  "last_activity" timestamp
);

CREATE TABLE IF NOT EXISTS "family_invitations" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL,
  "role" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "expires_at" timestamp NOT NULL,
  "family_id" text NOT NULL REFERENCES "families" ("id"),
  "invited_by" text NOT NULL REFERENCES "users" ("id"),
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_access_logs" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users" ("id"),
  "action" text NOT NULL,
  "ip_address" text,
  "user_agent" text,
  "timestamp" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_family_id_idx" ON "users" ("family_id");
CREATE INDEX IF NOT EXISTS "family_invitations_email_idx" ON "family_invitations" ("email");
CREATE INDEX IF NOT EXISTS "family_invitations_family_id_idx" ON "family_invitations" ("family_id");
CREATE INDEX IF NOT EXISTS "user_access_logs_user_id_idx" ON "user_access_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "user_access_logs_timestamp_idx" ON "user_access_logs" ("timestamp"); 