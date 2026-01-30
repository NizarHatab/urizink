export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  userId: string;
  artistId?: string;
  subject?: string;
  description: string;
  status: BookingStatus;
  scheduledAt?: string;
  createdAt: string;
}
