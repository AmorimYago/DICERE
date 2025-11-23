/*
  Warnings:

  - You are about to drop the column `isActive` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isActive",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isCustom" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "icon" SET DEFAULT '📁',
ALTER COLUMN "color" SET DEFAULT '#6B7280',
ALTER COLUMN "order" SET DEFAULT 0;
