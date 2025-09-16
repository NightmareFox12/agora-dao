import { z } from 'zod';

const noAccentsRegex = /^[a-zA-Z0-9\s.,:;!?'"()\-_/]*$/;

export const DaoFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: 'DAO name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Character limit exceeded',
    })
    .refine((val) => noAccentsRegex.test(val), {
      message: 'Name must not contain accents or special characters.',
    }),

  description: z
    .string()
    .trim()
    .min(15, {
      message: 'Description must be at least 15 characters.',
    })
    .max(400, {
      message: 'Character limit exceeded',
    })
    .refine((val) => noAccentsRegex.test(val), {
      message: 'Description must not contain accents or special characters.',
    }),

  categories: z.string(),

  logo: z
    .instanceof(File)
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Only image files are allowed.',
    })
    .optional(),

  isPublic: z.boolean(),
});
