// src/app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, schedule, users } from "@/db/schema";
import { bookingSchema } from "@/lib/validators/booking";
import { eq, and, gte, lte } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    return await db.transaction(async (tx) => {
      // 1️⃣ Check if slot exists & available
      const slot = await tx.query.schedule.findFirst({
        where: and(
          eq(schedule.artistId, data.artistId!),
          eq(schedule.status, "available"),
          eq(schedule.startTime, new Date(data.scheduledAt))
        ),
      });

      if (!slot) {
        return NextResponse.json(
          { error: "Time slot not available" },
          { status: 409 }
        );
      }

      // 2️⃣ Create or get user
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
          },
        })
        .returning();

      // 3️⃣ Create booking
      const [booking] = await tx
        .insert(bookings)
        .values({
          userId: user.id,
          artistId: data.artistId,
          description: data.description,
          status: "confirmed",
          scheduledAt: new Date(data.scheduledAt),
        })
        .returning();

      // 4️⃣ Lock schedule slot
      await tx
        .update(schedule)
        .set({ status: "booked" })
        .where(eq(schedule.id, slot.id));

      return NextResponse.json({ booking });
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}
