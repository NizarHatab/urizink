export interface DashboardStats {
  pendingBookings: number;
  averageRating: number | null;
  newReviewsCount: number;
  recentActivity: Array<{
    id: string;
    type: "booking";
    text: string;
    time: string;
    createdAt: string;
  }>;
  todaySchedule: Array<{
    id: string;
    time: string;
    name: string;
    meta: string;
    active: boolean;
    scheduledAt: string;
  }>;
}
