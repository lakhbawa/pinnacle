/*
  Warnings:

  - You are about to drop the column `is_completed` on the `actions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "actions_outcome_id_is_completed_idx";

-- AlterTable
ALTER TABLE "actions" DROP COLUMN "is_completed",
ADD COLUMN     "position" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "actions_outcome_id_completed_at_idx" ON "actions"("outcome_id", "completed_at");
