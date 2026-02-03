import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { authConfig } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(authConfig.cookieName)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated", statusCode: 401 },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token", statusCode: 401 },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: payload.sub,
        email: payload.email,
        isAdmin: payload.isAdmin,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error("AUTH_ME_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}
