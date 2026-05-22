import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { authConfig, verifyToken, type JWTPayload } from "@/lib/auth";

const DEV_FALLBACK_SECRET = "urizink-admin-secret-change-in-production";

export function isJwtSecretConfigured(): boolean {
  const secret = process.env.JWT_SECRET;
  return Boolean(secret && secret.length >= 16 && secret !== DEV_FALLBACK_SECRET);
}

let jwtWarningLogged = false;

function warnMissingJwtSecret(): void {
  if (jwtWarningLogged || process.env.NODE_ENV !== "production") return;
  if (isJwtSecretConfigured()) return;
  jwtWarningLogged = true;
  console.error(
    "[security] JWT_SECRET must be set to a strong random value in production.",
  );
}

export async function getAdminPayloadFromToken(
  token: string | undefined,
): Promise<JWTPayload | null> {
  if (!token) return null;
  if (process.env.NODE_ENV === "production" && !isJwtSecretConfigured()) {
    warnMissingJwtSecret();
    return null;
  }
  const payload = await verifyToken(token);
  if (!payload?.isAdmin) return null;
  return payload;
}

export async function getAdminPayloadFromRequest(
  request: NextRequest,
): Promise<JWTPayload | null> {
  const token = request.cookies.get(authConfig.cookieName)?.value;
  return getAdminPayloadFromToken(token);
}

export async function getAdminPayloadFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.cookieName)?.value;
  return getAdminPayloadFromToken(token);
}
