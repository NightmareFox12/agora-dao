import { z } from "zod";

export const DaoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: "DAO name must be at least 2 characters.",
    })
    .max(50, {
      message: "Character limit exceeded",
    }),

  description: z
    .string()
    .trim()
    .min(15, {
      message: "Description must be at least 15 characters.",
    })
    .max(300, {
      message: "Character limit exceeded",
    }),

  categories: z.string().min(1, {
    message: "The category cannot be empty",
  }),

  logo: z
    .instanceof(File)
    .refine(file => file.type.startsWith("image/"), {
      message: "Only image files are allowed.",
    })
    .optional(),

  isPublic: z.boolean(),
});
