export type ScheduleStatus = "available" | "booked" | "blocked";

/** One day's working window in the weekly schedule (e.g. Mon 12:00–20:00). */
export interface ArtistAvailabilitySlot {
  id: string;
  /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
  dayOfWeek: number;
  /** "HH:mm" or "HH:mm:ss" */
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface ScheduleBlock {
  id: string;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
  createdAt: string;
}

/** Booking with client name for calendar display. */
export interface ScheduleBooking {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  firstName: string;
  lastName: string;
  description: string;
  placement: string;
  size: string;
  status: string;
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  /** Recurring weekly hours (which days/hours the studio works). */
  availability: ArtistAvailabilitySlot[];
  blocks: ScheduleBlock[];
  bookings: ScheduleBooking[];
}

/** Available slot for booking (start time in ISO, or date + time string). */
export interface AvailableSlot {
  start: string;
  end: string;
  /** Display label e.g. "12:00 PM" */
  label?: string;
}
