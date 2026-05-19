import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authConfig, verifyToken } from "@/lib/auth";

export async function requireAdminApi(): Promise<
  { ok: true } | { ok: false; response: NextResponse }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.cookieName)?.value;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const payload = await verifyToken(token);
  if (!payload?.isAdmin) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true };
}
