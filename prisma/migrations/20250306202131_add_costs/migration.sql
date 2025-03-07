/*
  Warnings:

  - You are about to drop the column `remainingPrice` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "remainingPrice",
ADD COLUMN     "costs" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "remainingCosts" DOUBLE PRECISION NOT NULL DEFAULT 0;
