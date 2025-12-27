-- CreateEnum
CREATE TYPE "OutcomeStatus" AS ENUM ('ACTIVE', 'PARKED', 'COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "outcomes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "successMetricValue" DOUBLE PRECISION NOT NULL,
    "successMetricUnit" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" "OutcomeStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "outcomeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
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

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "outcomes_userId_status_idx" ON "outcomes"("userId", "status");

-- CreateIndex
CREATE INDEX "tasks_user_id_scheduled_for_idx" ON "tasks"("user_id", "scheduled_for");

-- CreateIndex
CREATE INDEX "tasks_outcome_id_is_completed_idx" ON "tasks"("outcome_id", "is_completed");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_outcomeId_fkey" FOREIGN KEY ("outcomeId") REFERENCES "outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
