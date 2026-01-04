/*
  Warnings:

  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_driver_id_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_outcome_id_fkey";

-- DropTable
DROP TABLE "tasks";

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "outcome_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "last_moved_outcome_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "actions_user_id_scheduled_for_idx" ON "actions"("user_id", "scheduled_for");

-- CreateIndex
CREATE INDEX "actions_outcome_id_is_completed_idx" ON "actions"("outcome_id", "is_completed");

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
