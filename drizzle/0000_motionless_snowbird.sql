CREATE TABLE "Family" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "FamilyInvitation" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"familyId" text NOT NULL,
	"inviterId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"firstName" varchar(255),
	"lastName" varchar(255),
	"role" text DEFAULT 'FAMILY_MEMBER' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"familyId" text,
	"isHeadOfFamily" boolean DEFAULT false NOT NULL,
	"profileImage" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_familyId_Family_id_fk" FOREIGN KEY ("familyId") REFERENCES "public"."Family"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_inviterId_User_id_fk" FOREIGN KEY ("inviterId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_Family_id_fk" FOREIGN KEY ("familyId") REFERENCES "public"."Family"("id") ON DELETE no action ON UPDATE no action;