import { z } from "zod";

export const bookingCreateSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(
    "Invalid email address"
  ),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .max(20),
  description: z.string().min(10),
  placement: z.string().min(2),
  size: z.string().min(1),
  //change to date and time 
  date: z.string().min(1),
  time: z.string().min(1),
 
});