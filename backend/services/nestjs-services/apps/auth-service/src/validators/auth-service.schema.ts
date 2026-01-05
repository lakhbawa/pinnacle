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


export const createAccountSchema = z.object({
  user_id: required(),
  email: required(),
  password: required(),

})



export type createAccountSchema = z.infer<typeof createAccountSchema>;

