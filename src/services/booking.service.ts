// src/lib/services/booking.service.ts
import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { findOrCreateUser } from "./user.service";
import { Booking, BookingCreateInput, BookingResponse } from "@/types";

export async function createBooking(data: BookingCreateInput) {
    const user = await findOrCreateUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isAdmin: false,
    });

    let scheduledAt: Date | undefined;

    if (data.date && data.time) {
        const dateTimeString = `${data.date}T${data.time}:00`;
        const parsedDate = new Date(dateTimeString);

        if (isNaN(parsedDate.getTime())) {
            throw new Error("Invalid date/time combination");
        }

        scheduledAt = parsedDate;
    }

    const [booking] = await db
        .insert(bookings)
        .values({
            userId: user.id,
            description: data.description,
            placement: data.placement,
            size: data.size,
            scheduledAt,
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
            artistId: bookings.artistId,
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
        artistId: row.artistId ?? undefined,
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
            artistId: bookings.artistId,
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
        artistId: row.artistId ?? undefined,
        scheduledAt: row.scheduledAt?.toISOString(),
        durationMinutes: row.durationMinutes ?? undefined,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
    };
}

const CONFIRMABLE: Booking["status"][] = ["pending"];
const CANCELLABLE: Booking["status"][] = ["pending", "confirmed"];

export async function updateBookingStatus(
    id: string,
    status: "confirmed" | "cancelled"
): Promise<Booking | null> {
    const existing = await getBookingById(id);
    if (!existing) return null;

    if (status === "confirmed" && !CONFIRMABLE.includes(existing.status)) {
        throw new Error("Only pending bookings can be confirmed");
    }
    if (status === "cancelled" && !CANCELLABLE.includes(existing.status)) {
        throw new Error("Only pending or confirmed bookings can be cancelled");
    }

    const [updated] = await db
        .update(bookings)
        .set({ status })
        .where(eq(bookings.id, id))
        .returning();

    if (!updated) return null;

    return getBookingById(id);
}