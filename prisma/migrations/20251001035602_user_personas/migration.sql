/*
  Warnings:

  - Added the required column `contact` to the `Agency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Agency` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('ALTORA_ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "AgencyRole" AS ENUM ('AGENCY_ADMIN', 'TEAM_MEMBER');

-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "theme" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "globalRole" "GlobalRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgencyMember" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "AgencyRole" NOT NULL DEFAULT 'TEAM_MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgencyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traveler" (
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "preferences" JSONB,

    CONSTRAINT "Traveler_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Traveler_userId_key" ON "Traveler"("userId");

-- CreateIndex
CREATE INDEX "Agency_slug_idx" ON "Agency"("slug");

-- AddForeignKey
ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traveler" ADD CONSTRAINT "Traveler_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
