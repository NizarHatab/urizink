import "server-only";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq, and } from "drizzle-orm";
import { verifyPassword } from "@/lib/auth";

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
};

/** Find admin by email or phone (with password hash for verification). */
export async function findAdminByEmailOrPhone(
  emailOrPhone: string
): Promise<(AdminUser & { passwordHash: string }) | null> {
  const value = emailOrPhone.trim();
  const isEmail = value.includes("@");
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      isAdmin: users.isAdmin,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(
      and(
        eq(users.isAdmin, true),
        isEmail
          ? eq(users.email, value.toLowerCase())
          : eq(users.phone, value)
      )
    )
    .limit(1);

  if (!row || !row.passwordHash) return null;
  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    isAdmin: row.isAdmin,
    passwordHash: row.passwordHash,
  };
}

export async function verifyAdminCredentials(
  emailOrPhone: string,
  password: string
): Promise<AdminUser | null> {
  const user = await findAdminByEmailOrPhone(emailOrPhone);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
  };
}
