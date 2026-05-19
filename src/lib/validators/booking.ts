import { z } from "zod";

export const bookingCreateSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    email: z.string().trim().email("Invalid email address"),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .max(20),
    description: z
      .string()
      .trim()
      .min(
        10,
        "Describe your tattoo idea in at least 10 characters (style, subject, size, etc.)"
      ),
    placement: z.string().trim().min(2, "Select a placement"),
    size: z.string().trim().min(1, "Select a size"),
    date: z.string().optional(),
    time: z.string().optional(),
  })
  .refine(
    (data) => {
      const d = data.date?.trim() ?? "";
      const t = data.time?.trim() ?? "";
      return (!d && !t) || (d.length > 0 && t.length > 0);
    },
    {
      message: "Select both a date and time, or leave both empty to request without a slot.",
      path: ["date"],
    }
  );
