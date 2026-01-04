import { z } from 'zod';

export function required() {
  return z
    .string({ error: 'This field is required.' })
    .min(1, { message: 'This field is required.' });
}

export function requiredNumber() {
  return z.number({ error: 'This field must be a number.' });
}

export function positiveNumber() {
  return z
    .number({ error: 'This field must be a number.' })
    .positive({ message: 'This field must be greater than 0.' });
}

export function minLength(min: number) {
  return z
    .string({ error: 'This field is required.' })
    .min(min, { message: `This field must be at least ${min} characters.` });
}

export function maxLength(max: number) {
  return z
    .string({ error: 'This field is required.' })
    .max(max, { message: `This field may not exceed ${max} characters.` });
}

export function between(min: number, max: number) {
  return z
    .string({ error: 'This field is required.' })
    .min(min, { message: `This field must be at least ${min} characters.` })
    .max(max, { message: `This field may not exceed ${max} characters.` });
}

export function email() {
  return z
    .string({ error: 'This field is required.' })
    .email({ message: 'This field must be a valid email address.' });
}

export function optional<T extends z.ZodTypeAny>(schema: T) {
  return schema.optional();
}

export function nullable<T extends z.ZodTypeAny>(schema: T) {
  return schema.nullable();
}