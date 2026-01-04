/*
  Warnings:

  - Added the required column `user_id` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "OutcomeStatus" ADD VALUE 'UNSPECIFIED';

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "user_id" TEXT NOT NULL;
