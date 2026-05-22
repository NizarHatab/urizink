import { NextResponse } from "next/server";
import type { JWTPayload } from "@/lib/auth";
import {
  getAdminPayloadFromCookies,
  isJwtSecretConfigured,
} from "@/lib/verify-admin-session";

export type AdminApiAuth =
  | { ok: true; admin: JWTPayload }
  | { ok: false; response: NextResponse };

export async function requireAdminApi(): Promise<AdminApiAuth> {
  if (process.env.NODE_ENV === "production" && !isJwtSecretConfigured()) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Server authentication is not configured" },
        { status: 503 },
      ),
    };
  }

  const payload = await getAdminPayloadFromCookies();
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, admin: payload };
}
