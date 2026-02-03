import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { reviews } from "@/db/schema/reviews";
import { users } from "@/db/schema/users";
import { eq, desc } from "drizzle-orm";
import type { DashboardStats } from "@/types/dashboard";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function isToday(d: Date): boolean {
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function isCurrentSlot(scheduledAt: string): boolean {
  const start = new Date(scheduledAt).getTime();
  const now = Date.now();
  const slotMs = 60 * 60 * 1000; // 1 hour slot
  return now >= start && now < start + slotMs;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Pending bookings count
  const pendingRows = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(eq(bookings.status, "pending"));
  const pendingBookings = pendingRows.length;

  // Reviews: average rating and count in last 7 days
  const reviewRows = await db
    .select({
      rating: reviews.rating,
      createdAt: reviews.createdAt,
    })
    .from(reviews);
  const averageRating =
    reviewRows.length > 0
      ? reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewRows.length
      : null;
  const newReviewsCount = reviewRows.filter(
    (r) => r.createdAt && new Date(r.createdAt) >= sevenDaysAgo
  ).length;

  // Recent bookings (last 8) with user names
  const recentRows = await db
    .select({
      id: bookings.id,
      description: bookings.description,
      size: bookings.size,
      status: bookings.status,
      createdAt: bookings.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .orderBy(desc(bookings.createdAt))
    .limit(8);

  const recentActivity = recentRows.map((row) => {
    const name = [row.firstName, row.lastName].filter(Boolean).join(" ").trim() || "Client";
    const initial = name.split(" ").map((n) => n[0]).join("").slice(0, 2) || "?";
    const shortName = name ? `${initial}.` : "Someone";
    const desc = row.description?.slice(0, 40) || "a project";
    const text =
      row.status === "completed"
        ? `${shortName} completed session`
        : `${shortName} booked ${desc}${desc.length >= 40 ? "…" : ""}`;
    return {
      id: row.id,
      type: "booking" as const,
      text,
      time: formatRelativeTime(row.createdAt.toISOString()),
      createdAt: row.createdAt.toISOString(),
    };
  });

  // Today's schedule: bookings where scheduledAt is today
  const allBookings = await db
    .select({
      id: bookings.id,
      description: bookings.description,
      size: bookings.size,
      scheduledAt: bookings.scheduledAt,
      firstName: users.firstName,
      lastName: users.lastName,
      status: bookings.status,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id));

  const todayBookings = allBookings
    .filter((b) => b.scheduledAt && isToday(new Date(b.scheduledAt)))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime()
    );
  // dont get canceled bookings in today schedule
  const todaySchedule = todayBookings
    .filter((b) => b.status !== "cancelled" && b.status !== "confirmed")
    .map((row) => {
      const scheduledAt = row.scheduledAt!.toISOString();
      const d = new Date(row.scheduledAt!);
      const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const name = [row.firstName, row.lastName].filter(Boolean).join(" ").trim() || "—";
      const metaShort = row.description?.slice(0, 30) || row.size || "—";
      const meta = metaShort + (row.description && row.description.length > 30 ? "…" : "");
      return {
        id: row.id,
        time,
        name,
        meta,
        active: isCurrentSlot(scheduledAt),
        scheduledAt,
      };
    });


  return {
    pendingBookings,
    averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
    newReviewsCount,
    recentActivity,
    todaySchedule,
  };
}
