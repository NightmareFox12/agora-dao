import { z } from 'zod';

const noAccentsRegex = /^[a-zA-Z0-9\s.,:;!?'"()\-_/]*$/;

export const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, {
      message: 'Title must be at least 5 characters.',
    })
    .max(50, {
      message: 'Character limit exceeded',
    })
    .refine((val) => noAccentsRegex.test(val), {
      message: 'Title must not contain accents or special characters.',
    }),

  description: z
    .string()
    .trim()
    .min(30, {
      message: 'Description must be at least 30 characters.',
    })
    .max(1000, {
      message: 'Character limit exceeded',
    })
    .refine((val) => noAccentsRegex.test(val), {
      message: 'Description must not contain accents or special characters.',
    }),

  category: z.string().refine((val) => val !== 'default', {
    message: 'Please pick a category',
  }),
  // .transform((val) => BigInt(val)),

  difficulty: z.string().refine((val) => val !== 'default', {
    message: 'Please pick a category',
  }),
  reward: z.string(),
  deadline: z.date().optional(),
});

/**
 * title
 * description
 * category/tag
 * difficulty
 * amount
 * deadline
 */
