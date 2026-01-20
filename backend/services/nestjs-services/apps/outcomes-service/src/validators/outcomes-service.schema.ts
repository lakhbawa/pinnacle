import { z } from 'zod';
import Long from 'long';
import { required, positiveNumber, requiredNumber } from "@app/common/helpers/validation/validation-rules";


const longToNumber = (v: unknown) => {
  if (v === undefined || v === null || v === '') return undefined;
  if (Long.isLong(v)) return v.toNumber();
  if (typeof v === 'string') {
    const parsed = parseFloat(v);
    return isNaN(parsed) ? undefined : parsed;
  }
  return v;
};

export const createOutcomeSchema = z.object({
  user_id: required(),
  title: required(),
  why_it_matters: required(),
  deadline: z.object({
    seconds: z.preprocess(longToNumber, requiredNumber()),
    nanos: z.number().optional(),
  }),
});

export const createDriverSchema = z.object({
  user_id: required(),
  title: required(),
  outcome_id: required(),
})

export const createActionSchema = z.object({
  user_id: required(),
  title: required(),
  outcome_id: required(),
  driver_id: required(),
})

export const createSuccessMetricSchema = z.object({
  outcome_id: required(),
  metric_name: required(),
  target_value: z.preprocess(longToNumber, positiveNumber()),
  current_value: z.preprocess(longToNumber, z.number().optional()),
  unit: required(),
  description: z.string().optional(),
})

export type CreateOutcomeInput = z.infer<typeof createOutcomeSchema>;

export type CreateDriverInput = z.infer<typeof createDriverSchema>;

export type CreateSuccessMetricInput = z.infer<typeof createSuccessMetricSchema>;