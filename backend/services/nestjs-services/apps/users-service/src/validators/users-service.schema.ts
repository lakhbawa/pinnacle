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


export const createUserSchema = z.object({
  name: required(),
  email: required(),
})



export type createUserSchema = z.infer<typeof createUserSchema>;

