import { bookingCreateSchema } from "@/lib/validators/booking";
import { z } from "zod";
import { ApiResponse } from "./api";

// src/types/booking.ts
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  description: string;
  placement: string;
  size: string;
  artistId?: string;
  scheduledAt?: string;
  /** Appointment length in minutes; default 60. */
  durationMinutes?: number;
  status: BookingStatus;
  createdAt: string;
}


export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

export type BookingResponse = ApiResponse<Booking[]>;