import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, authConfig } from "@/lib/auth";
import type { JWTPayload } from "@/lib/auth";

export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

/**
 * Get the authenticated user from the cookie token.
 * Returns null if not authenticated or token is invalid.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(authConfig.cookieName)?.value;
    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin ?? false,
    };
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
        error: "Admin access required",
        statusCode: 403,
      },
      { status: 403 }
    );
  }
  return user;
}
