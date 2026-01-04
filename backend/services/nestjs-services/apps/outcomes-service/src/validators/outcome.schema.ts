import { z } from 'zod';
import Long from 'long';
import { required, positiveNumber, requiredNumber } from "../../../../libs/validation";

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
  success_metric_value: z.preprocess(longToNumber, positiveNumber()),
  success_metric_unit: required(),
  deadline: z.object({
    seconds: z.preprocess(longToNumber, requiredNumber()),
    nanos: z.number().optional(),
  }),
});

export type CreateOutcomeInput = z.infer<typeof createOutcomeSchema>;