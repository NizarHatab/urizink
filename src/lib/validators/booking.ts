// src/lib/validators/booking.ts
import { z } from "zod";

export const bookingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  artistId: z.string().uuid().optional(),
  description: z.string().min(10),
  scheduledAt: z.string().datetime(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
