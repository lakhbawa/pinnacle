import {z} from 'zod';
import Long from "long";

export const createOutcomeSchema = z.object({
    userId: z.string().min(1),
    title: z.string().min(1),
    whyItMatters: z.string().min(1),

    successMetricValue: z.preprocess(
        (v) => (Long.isLong(v) ? v.toNumber() : v),
        z.number().positive()
    ),

    successMetricUnit: z.string().min(1),

    deadline: z.object({
        seconds: z.preprocess(
            (v) => (Long.isLong(v) ? v.toNumber() : v),
            z.number()
        ),
        nanos: z.number().optional(),
    }),
});
