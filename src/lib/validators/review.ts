import { z } from "zod";

export const reviewCreateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(10, "Please write at least 10 characters").max(2000),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
