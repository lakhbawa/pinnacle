-- DropIndex
DROP INDEX "actions_outcome_id_completed_at_idx";

-- AlterTable
ALTER TABLE "actions" ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "description" TEXT;

-- CreateIndex
CREATE INDEX "actions_outcome_id_is_completed_idx" ON "actions"("outcome_id", "is_completed");
