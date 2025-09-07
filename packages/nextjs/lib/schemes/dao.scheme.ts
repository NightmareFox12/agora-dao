import { z } from "zod";

export const DaoSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categories: z.string().min(1, {
    message: "The category cannot be empty",
  }),
  isPublic: z.boolean(),
});
