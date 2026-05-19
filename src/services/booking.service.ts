import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { durationMinutesFromSize } from "@/lib/booking-duration";
import { isSlotAvailable } from "@/services/schedule.service";
import { findOrCreateUserByEmail } from "./user.service";
import { Booking, BookingCreateInput, BookingResponse } from "@/types";

export async function createBooking(data: BookingCreateInput) {
  const user = await findOrCreateUserByEmail({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  });

  let scheduledAt: Date | undefined;

  if (data.date?.trim() && data.time?.trim()) {
    const dateTimeString = `${data.date.trim()}T${data.time.trim()}:00`;
    const parsedDate = new Date(dateTimeString);

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date/time combination");
    }

    if (parsedDate.getTime() < Date.now()) {
      throw new Error("Cannot book a time in the past");
    }

    const durationMinutes = durationMinutesFromSize(data.size);

    const available = await isSlotAvailable(
      data.date.trim(),
      data.time.trim(),
      durationMinutes
    );
    if (!available) {
      throw new Error(
        "That time is no longer available for this session length. Please pick another slot."
      );
    }

    scheduledAt = parsedDate;
  }

  const durationMinutes = durationMinutesFromSize(data.size);

  const [booking] = await db
    .insert(bookings)
    .values({
      userId: user.id,
      description: data.description,
      placement: data.placement,
      size: data.size,
      scheduledAt,
      durationMinutes,
      status: "pending",
    })
    .returning();

  return booking;
}

export async function getBookings(): Promise<BookingResponse> {
  const rows = await db
    .select({
      id: bookings.id,
      userId: bookings.userId,
      description: bookings.description,
      placement: bookings.placement,
      size: bookings.size,
      scheduledAt: bookings.scheduledAt,
      durationMinutes: bookings.durationMinutes,
      status: bookings.status,
      createdAt: bookings.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id));

  const data: Booking[] = rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    description: row.description,
    placement: row.placement,
    size: row.size,
    scheduledAt: row.scheduledAt?.toISOString(),
    durationMinutes: row.durationMinutes ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  return {
    success: true,
    data,
  };
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const [row] = await db
    .select({
      id: bookings.id,
      userId: bookings.userId,
      description: bookings.description,
      placement: bookings.placement,
      size: bookings.size,
      scheduledAt: bookings.scheduledAt,
      durationMinutes: bookings.durationMinutes,
      status: bookings.status,
      createdAt: bookings.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .where(eq(bookings.id, id))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    userId: row.userId,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    description: row.description,
    placement: row.placement,
    size: row.size,
    scheduledAt: row.scheduledAt?.toISOString(),
    durationMinutes: row.durationMinutes ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

type BookingStatusUpdate = "confirmed" | "cancelled" | "completed";

export async function updateBookingStatus(
  id: string,
  status: BookingStatusUpdate
): Promise<Booking | null> {
  const existing = await getBookingById(id);
  if (!existing) return null;

  if (status === "confirmed" && existing.status !== "pending") {
    throw new Error("Only pending bookings can be confirmed");
  }
  if (
    status === "cancelled" &&
    existing.status !== "pending" &&
    existing.status !== "confirmed"
  ) {
    throw new Error("Only pending or confirmed bookings can be cancelled");
  }
  if (status === "completed" && existing.status !== "confirmed") {
    throw new Error("Only confirmed bookings can be marked completed");
  }

  await db.update(bookings).set({ status }).where(eq(bookings.id, id));

  return getBookingById(id);
}
