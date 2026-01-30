export type SlotStatus = "available" | "booked" | "blocked";

export interface ScheduleSlot {
  id: string;
  artistId: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}
