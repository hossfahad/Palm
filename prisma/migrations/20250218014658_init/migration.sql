-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GivingVehicle" AS ENUM ('DAF', 'FOUNDATION', 'TRUST', 'DIRECT');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('MONTHLY_SUMMARY', 'QUARTERLY_DETAIL', 'ANNUAL_IMPACT', 'TAX_DOCUMENTS', 'GRANT_HISTORY');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('home', 'business', 'mailing');

-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('view', 'recommend', 'none');

-- CreateEnum
CREATE TYPE "CommunicationFrequency" AS ENUM ('weekly', 'monthly', 'quarterly');

-- CreateEnum
CREATE TYPE "FamilyMeetingFrequency" AS ENUM ('monthly', 'quarterly', 'annually');

-- CreateEnum
CREATE TYPE "KYCStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('AGREEMENT', 'TAX', 'GRANT_LETTER', 'CORRESPONDENCE');

-- CreateEnum
CREATE TYPE "SponsorType" AS ENUM ('COMMUNITY', 'NATIONAL', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "status" "ClientStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "preferredName" TEXT,
    "preferredPronouns" TEXT,
    "primaryAddressId" TEXT NOT NULL,
    "alternateAddressId" TEXT,
    "preferredContactMethod" TEXT NOT NULL,
    "timeZone" TEXT,
    "advisorId" TEXT NOT NULL,
    "relationshipStartDate" TIMESTAMP(3) NOT NULL,
    "firmClientId" TEXT,
    "secondaryAdvisors" TEXT[],
    "relationshipManager" TEXT,
    "causeAreas" TEXT[],
    "preferencesId" TEXT NOT NULL,
    "complianceId" TEXT NOT NULL,
    "accessId" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GivingGoals" (
    "id" TEXT NOT NULL,
    "annualTarget" DOUBLE PRECISION,
    "impactAreas" TEXT[],
    "preferredVehicles" "GivingVehicle"[],
    "clientId" TEXT NOT NULL,

    CONSTRAINT "GivingGoals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantPreferences" (
    "id" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "recurringPreferred" BOOLEAN NOT NULL,
    "minimumGrantSize" DOUBLE PRECISION,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "GrantPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sponsor" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "DAFAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherGivingAccount" (
    "id" TEXT NOT NULL,
    "type" "GivingVehicle" NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "institution" TEXT,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "OtherGivingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientPreferences" (
    "id" TEXT NOT NULL,
    "communicationFrequency" "CommunicationFrequency" NOT NULL,
    "reportingPreferences" "ReportType"[],
    "marketingConsent" BOOLEAN NOT NULL,
    "languagePreference" TEXT NOT NULL,

    CONSTRAINT "ClientPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "philanthropicInvolvement" BOOLEAN NOT NULL,
    "accessLevel" "AccessLevel",
    "familyInfoId" TEXT NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessorPlan" (
    "id" TEXT NOT NULL,
    "successorType" TEXT NOT NULL,
    "successors" JSONB NOT NULL,
    "familyInfoId" TEXT NOT NULL,

    CONSTRAINT "SuccessorPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyInfo" (
    "id" TEXT NOT NULL,
    "familyMeetingFrequency" "FamilyMeetingFrequency",
    "nextGenPrograms" BOOLEAN NOT NULL,
    "familyGivingCommittee" BOOLEAN,
    "educationPrograms" TEXT[],
    "clientId" TEXT NOT NULL,

    CONSTRAINT "FamilyInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "documentsId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documents" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compliance" (
    "id" TEXT NOT NULL,
    "kycStatus" "KYCStatus" NOT NULL,
    "kycDate" TIMESTAMP(3),
    "riskRating" TEXT,
    "restrictions" TEXT[],

    CONSTRAINT "Compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Access" (
    "id" TEXT NOT NULL,
    "portalAccess" BOOLEAN NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAccessInvitation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccessInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "SponsorType" NOT NULL,
    "description" TEXT NOT NULL,
    "minimum_contribution" DOUBLE PRECISION NOT NULL,
    "fees" TEXT NOT NULL,
    "programs" JSONB NOT NULL,
    "geographic_focus" TEXT[],
    "features" TEXT[],
    "legal_documents" JSONB,
    "contact_info" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grants" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "daf_id" TEXT NOT NULL,
    "charity_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "purpose" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "status" "GrantStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduled_date" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_primaryAddressId_key" ON "Client"("primaryAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_alternateAddressId_key" ON "Client"("alternateAddressId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_preferencesId_key" ON "Client"("preferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_complianceId_key" ON "Client"("complianceId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_accessId_key" ON "Client"("accessId");

-- CreateIndex
CREATE UNIQUE INDEX "GivingGoals_clientId_key" ON "GivingGoals"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "GrantPreferences_clientId_key" ON "GrantPreferences"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyInfo_clientId_key" ON "FamilyInfo"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Documents_clientId_key" ON "Documents"("clientId");

-- CreateIndex
CREATE INDEX "ClientAccessInvitation_clientId_idx" ON "ClientAccessInvitation"("clientId");

-- CreateIndex
CREATE INDEX "ClientAccessInvitation_email_idx" ON "ClientAccessInvitation"("email");

-- CreateIndex
CREATE INDEX "ClientAccessInvitation_status_idx" ON "ClientAccessInvitation"("status");

-- CreateIndex
CREATE INDEX "sponsors_type_idx" ON "sponsors"("type");

-- CreateIndex
CREATE INDEX "sponsors_minimum_contribution_idx" ON "sponsors"("minimum_contribution");

-- CreateIndex
CREATE INDEX "sponsors_name_idx" ON "sponsors"("name");

-- CreateIndex
CREATE INDEX "grants_client_id_idx" ON "grants"("client_id");

-- CreateIndex
CREATE INDEX "grants_daf_id_idx" ON "grants"("daf_id");

-- CreateIndex
CREATE INDEX "grants_charity_id_idx" ON "grants"("charity_id");

-- CreateIndex
CREATE INDEX "grants_status_idx" ON "grants"("status");

-- CreateIndex
CREATE INDEX "grants_created_at_idx" ON "grants"("created_at");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_primaryAddressId_fkey" FOREIGN KEY ("primaryAddressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_alternateAddressId_fkey" FOREIGN KEY ("alternateAddressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_preferencesId_fkey" FOREIGN KEY ("preferencesId") REFERENCES "ClientPreferences"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_complianceId_fkey" FOREIGN KEY ("complianceId") REFERENCES "Compliance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "Access"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GivingGoals" ADD CONSTRAINT "GivingGoals_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantPreferences" ADD CONSTRAINT "GrantPreferences_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFAccount" ADD CONSTRAINT "DAFAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherGivingAccount" ADD CONSTRAINT "OtherGivingAccount_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyInfoId_fkey" FOREIGN KEY ("familyInfoId") REFERENCES "FamilyInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessorPlan" ADD CONSTRAINT "SuccessorPlan_familyInfoId_fkey" FOREIGN KEY ("familyInfoId") REFERENCES "FamilyInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInfo" ADD CONSTRAINT "FamilyInfo_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_documentsId_fkey" FOREIGN KEY ("documentsId") REFERENCES "Documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documents" ADD CONSTRAINT "Documents_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccessInvitation" ADD CONSTRAINT "ClientAccessInvitation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grants" ADD CONSTRAINT "grants_daf_id_fkey" FOREIGN KEY ("daf_id") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
