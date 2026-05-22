import "server-only";
import { NextResponse } from "next/server";
import type { JWTPayload } from "@/lib/auth";
import { getAdminPayloadFromCookies } from "@/lib/verify-admin-session";

export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

function payloadToUser(payload: JWTPayload): AuthenticatedUser {
  return {
    id: payload.sub,
    email: payload.email,
    isAdmin: payload.isAdmin ?? false,
  };
}

/**
 * Get the authenticated user from the cookie token.
 * Returns null if not authenticated or token is invalid.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const payload = await getAdminPayloadFromCookies();
    if (!payload) return null;
    return payloadToUser(payload);
  } catch (error) {
    console.error("AUTH_ERROR:", error);
    return null;
  }
}

/**
 * Require authentication for an API route.
 * Returns the authenticated user or throws a NextResponse error.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw NextResponse.json(
      {
        success: false,
        error: "Authentication required",
        statusCode: 401,
      },
      { status: 401 }
    );
  }
  return user;
}

/**
 * Require admin authentication for an API route.
 * Returns the authenticated admin user or throws a NextResponse error.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!user.isAdmin) {
    throw NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
        statusCode: 401,
      },
      { status: 401 }
    );
  }
  return user;
}
