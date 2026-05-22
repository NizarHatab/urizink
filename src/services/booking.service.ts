import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { uploadBookingReferenceImages } from "@/lib/booking-reference-storage";
import { validateBookingReferenceFiles } from "@/lib/booking-reference-upload";
import { durationMinutesFromSize } from "@/lib/booking-duration";
import { parseReferenceImageUrls } from "@/lib/parse-booking-reference-urls";
import { parseHour, parseMinute } from "@/lib/schedule-helpers";
import { studioWallToUtc } from "@/lib/studio-time";
import { isSlotAvailable } from "@/services/schedule.service";
import { notifyNewBooking } from "@/lib/notifications/notify-studio";
import { findOrCreateUserByEmail } from "./user.service";
import { Booking, BookingCreateInput, BookingResponse } from "@/types";

export async function createBooking(
  data: BookingCreateInput,
  referenceFiles: File[] = []
) {
  if (referenceFiles.length > 0) {
    const fileCheck = validateBookingReferenceFiles(referenceFiles);
    if (!fileCheck.ok) {
      throw new Error(fileCheck.error);
    }
  }
  const user = await findOrCreateUserByEmail({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  });

  let scheduledAt: Date | undefined;

  if (data.date?.trim() && data.time?.trim()) {
    const dateStr = data.date.trim();
    const timeStr = data.time.trim().slice(0, 5);
    const parsedDate = studioWallToUtc(
      dateStr,
      parseHour(timeStr),
      parseMinute(timeStr)
    );

    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date/time combination");
    }

    if (parsedDate.getTime() < Date.now()) {
      throw new Error("Cannot book a time in the past");
    }

    const durationMinutes = durationMinutesFromSize(data.size);

    const available = await isSlotAvailable(dateStr, timeStr, durationMinutes);
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
      referenceImageUrls: [],
    })
    .returning();

  let referenceImageUrls: string[] = [];
  if (referenceFiles.length > 0) {
    referenceImageUrls = await uploadBookingReferenceImages(
      booking.id,
      referenceFiles
    );
    if (referenceImageUrls.length > 0) {
      await db
        .update(bookings)
        .set({ referenceImageUrls })
        .where(eq(bookings.id, booking.id));
    }
  }

  const result = { ...booking, referenceImageUrls };

  notifyNewBooking({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    description: data.description,
    placement: data.placement,
    size: data.size,
    scheduledAt: scheduledAt ?? null,
    referenceImageUrls,
    bookingId: booking.id,
  });

  return result;
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
      referenceImageUrls: bookings.referenceImageUrls,
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
    referenceImageUrls: parseReferenceImageUrls(row.referenceImageUrls),
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
      referenceImageUrls: bookings.referenceImageUrls,
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
    referenceImageUrls: parseReferenceImageUrls(row.referenceImageUrls),
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
