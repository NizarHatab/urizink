import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/services/auth.service";
import { signToken, authConfig } from "@/lib/auth";
import { isJwtSecretConfigured } from "@/lib/verify-admin-session";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (process.env.NODE_ENV === "production" && !isJwtSecretConfigured()) {
      console.error(
        "[auth] Login blocked: set JWT_SECRET (16+ chars) in production env.",
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Admin login is not configured on the server. Add JWT_SECRET in your hosting env and redeploy.",
          statusCode: 503,
        },
        { status: 503 },
      );
    }

    const body = await req.json();
    const { emailOrPhone, email, password } = body as {
      emailOrPhone?: string;
      email?: string;
      password?: string;
    };
    const loginId = emailOrPhone ?? email;

    if (!loginId || typeof loginId !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Email or phone and password are required", statusCode: 400 },
        { status: 400 }
      );
    }

    const user = await verifyAdminCredentials(loginId.trim(), password);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email/phone or password", statusCode: 401 },
        { status: 401 }
      );
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      statusCode: 200,
    });

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set(authConfig.cookieName, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: authConfig.tokenMaxAgeSec,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("AUTH_LOGIN_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}
