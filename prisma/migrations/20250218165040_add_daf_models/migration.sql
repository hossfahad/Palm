/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `DAFAccount` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `DAFAccount` table. All the data in the column will be lost.
  - You are about to drop the column `sponsor` on the `DAFAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[externalId]` on the table `DAFAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `advisorId` to the `DAFAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `externalId` to the `DAFAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DAFAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DAFAccount" DROP COLUMN "accountNumber",
DROP COLUMN "balance",
DROP COLUMN "sponsor",
ADD COLUMN     "advisorId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFSponsorInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "externalId" TEXT,
    "details" JSONB,
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFSponsorInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFBalances" (
    "id" TEXT NOT NULL,
    "currentBalance" DOUBLE PRECISION NOT NULL,
    "pendingBalance" DOUBLE PRECISION,
    "totalContributions" DOUBLE PRECISION NOT NULL,
    "totalGrants" DOUBLE PRECISION,
    "availableToGrant" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFBalances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFAccountHolder" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "permissions" JSONB,
    "relationship" TEXT,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAccess" TIMESTAMP(3),
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFAccountHolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFGrant" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "charityName" TEXT NOT NULL,
    "charityEIN" TEXT NOT NULL,
    "requestedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedDate" TIMESTAMP(3),
    "paidDate" TIMESTAMP(3),
    "scheduledDate" TIMESTAMP(3),
    "purpose" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFGrant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFContribution" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceType" TEXT NOT NULL,
    "sourceDetails" JSONB,
    "assetType" TEXT NOT NULL,
    "assetDetails" JSONB,
    "taxReceiptIssued" BOOLEAN NOT NULL DEFAULT false,
    "taxReceiptDate" TIMESTAMP(3),
    "taxReceiptId" TEXT,
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DAFDocument" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "tags" TEXT[],
    "dafAccountId" TEXT NOT NULL,

    CONSTRAINT "DAFDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DAFSponsorInfo_dafAccountId_key" ON "DAFSponsorInfo"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFSponsorInfo_dafAccountId_idx" ON "DAFSponsorInfo"("dafAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "DAFBalances_dafAccountId_key" ON "DAFBalances"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFBalances_dafAccountId_idx" ON "DAFBalances"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFAccountHolder_dafAccountId_idx" ON "DAFAccountHolder"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFGrant_dafAccountId_idx" ON "DAFGrant"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFContribution_dafAccountId_idx" ON "DAFContribution"("dafAccountId");

-- CreateIndex
CREATE INDEX "DAFDocument_dafAccountId_idx" ON "DAFDocument"("dafAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "DAFAccount_externalId_key" ON "DAFAccount"("externalId");

-- CreateIndex
CREATE INDEX "DAFAccount_clientId_idx" ON "DAFAccount"("clientId");

-- CreateIndex
CREATE INDEX "DAFAccount_advisorId_idx" ON "DAFAccount"("advisorId");

-- AddForeignKey
ALTER TABLE "DAFAccount" ADD CONSTRAINT "DAFAccount_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFSponsorInfo" ADD CONSTRAINT "DAFSponsorInfo_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFBalances" ADD CONSTRAINT "DAFBalances_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFAccountHolder" ADD CONSTRAINT "DAFAccountHolder_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFGrant" ADD CONSTRAINT "DAFGrant_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFContribution" ADD CONSTRAINT "DAFContribution_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DAFDocument" ADD CONSTRAINT "DAFDocument_dafAccountId_fkey" FOREIGN KEY ("dafAccountId") REFERENCES "DAFAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
