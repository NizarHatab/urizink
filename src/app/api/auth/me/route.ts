import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated", statusCode: 401 },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
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
