/*
  Warnings:

  - You are about to drop the column `lastLogin` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `portalAccess` on the `Access` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ClientAccessInvitation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ClientAccessInvitation` table. All the data in the column will be lost.
  - You are about to drop the `grants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sponsors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessId` to the `ClientAccessInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "grants" DROP CONSTRAINT "grants_client_id_fkey";

-- DropForeignKey
ALTER TABLE "grants" DROP CONSTRAINT "grants_daf_id_fkey";

-- DropIndex
DROP INDEX "ClientAccessInvitation_clientId_idx";

-- DropIndex
DROP INDEX "ClientAccessInvitation_email_idx";

-- DropIndex
DROP INDEX "ClientAccessInvitation_status_idx";

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "lastLogin",
DROP COLUMN "portalAccess",
ADD COLUMN     "canDelete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEdit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canInvite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canView" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customPermissions" JSONB,
ADD COLUMN     "documentAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "grantAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reportAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ClientAccessInvitation" DROP COLUMN "role",
DROP COLUMN "updatedAt",
ADD COLUMN     "accessId" TEXT NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- DropTable
DROP TABLE "grants";

-- DropTable
DROP TABLE "sponsors";

-- DropEnum
DROP TYPE "GrantStatus";

-- DropEnum
DROP TYPE "SponsorType";

-- AddForeignKey
ALTER TABLE "ClientAccessInvitation" ADD CONSTRAINT "ClientAccessInvitation_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "Access"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
