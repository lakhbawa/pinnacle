/*
  Warnings:

  - You are about to drop the column `createdAt` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `outcomeId` on the `drivers` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `successMetricUnit` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `successMetricValue` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `outcomes` table. All the data in the column will be lost.
  - You are about to drop the column `whyItMatters` on the `outcomes` table. All the data in the column will be lost.
  - Added the required column `outcome_id` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success_metric_unit` to the `outcomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success_metric_value` to the `outcomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `outcomes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `why_it_matters` to the `outcomes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "drivers" DROP CONSTRAINT "drivers_outcomeId_fkey";

-- DropIndex
DROP INDEX "outcomes_userId_status_idx";

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "createdAt",
DROP COLUMN "outcomeId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outcome_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "outcomes" DROP COLUMN "archivedAt",
DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "successMetricUnit",
DROP COLUMN "successMetricValue",
DROP COLUMN "userId",
DROP COLUMN "whyItMatters",
ADD COLUMN     "archived_at" TIMESTAMP(3),
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "success_metric_unit" TEXT NOT NULL,
ADD COLUMN     "success_metric_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD COLUMN     "why_it_matters" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "outcomes_user_id_status_idx" ON "outcomes"("user_id", "status");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
