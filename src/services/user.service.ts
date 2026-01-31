// src/lib/services/user.service.ts
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
interface FindOrCreateUserInput {
  email: string ;
  firstName: string;
  lastName: string;
  phone: string;
  isAdmin: boolean;
}

export async function findOrCreateUser(
  data: FindOrCreateUserInput
) {
  const existing = await db.select().from(users).where(eq(users.phone, data.phone)).then(rows => rows[0]);

  if (existing) return existing;

  const [user] = await db
    .insert(users)
    .values({
        email: data.email ,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        isAdmin: false,
        createdAt: new Date(),
    })
    .returning();

  return user;
}
