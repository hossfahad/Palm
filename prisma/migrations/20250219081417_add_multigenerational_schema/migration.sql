/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SYSTEM_ADMIN', 'ADVISOR', 'CLIENT', 'FAMILY_MEMBER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "familyId" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isHeadOfFamily" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastActivity" TIMESTAMP(3),
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "permissions" JSONB,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "givingPhilosophy" TEXT,
    "missionStatement" TEXT,
    "values" TEXT[],
    "meetingFrequency" "FamilyMeetingFrequency",
    "communicationPrefs" "CommunicationFrequency",
    "lastActivity" TIMESTAMP(3),

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "familyId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,

    CONSTRAINT "FamilyInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccessLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAccessLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Family_name_idx" ON "Family"("name");

-- CreateIndex
CREATE INDEX "FamilyInvitation_email_idx" ON "FamilyInvitation"("email");

-- CreateIndex
CREATE INDEX "FamilyInvitation_familyId_idx" ON "FamilyInvitation"("familyId");

-- CreateIndex
CREATE INDEX "UserAccessLog_userId_idx" ON "UserAccessLog"("userId");

-- CreateIndex
CREATE INDEX "UserAccessLog_timestamp_idx" ON "UserAccessLog"("timestamp");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_familyId_idx" ON "User"("familyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyInvitation" ADD CONSTRAINT "FamilyInvitation_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessLog" ADD CONSTRAINT "UserAccessLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
