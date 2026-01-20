CREATE TABLE "success_metrics" (
    "id" TEXT NOT NULL,
    "outcome_id" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "target_value" DOUBLE PRECISION NOT NULL,
    "current_value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "success_metrics_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "success_metrics_outcome_id_idx" ON "success_metrics"("outcome_id");

ALTER TABLE "success_metrics" ADD CONSTRAINT "success_metrics_outcome_id_fkey" FOREIGN KEY ("outcome_id") REFERENCES "outcomes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "outcomes" DROP COLUMN "success_metric_value";

ALTER TABLE "outcomes" DROP COLUMN "success_metric_unit";
