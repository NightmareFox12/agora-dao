import { z } from 'zod';

export const TaskFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, {
      message: 'DAO name must be at least 5 characters.',
    })
    .max(50, {
      message: 'Character limit exceeded',
    }),

  description: z
    .string()
    .trim()
    .min(30, {
      message: 'Description must be at least 30 characters.',
    })
    .max(500, {
      message: 'Character limit exceeded',
    }),

  category: z.string(),
  difficulty: z.string(),
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
