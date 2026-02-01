import { NextResponse } from "next/server";
import { verifyAdminCredentials } from "@/services/auth.service";
import { signToken, authConfig } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrPhone, password } = body as {
      emailOrPhone?: string;
      email?: string;
      password?: string;
    };
    const loginId = emailOrPhone ?? email;

    if (!loginId || typeof loginId !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Email or phone and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyAdminCredentials(loginId.trim(), password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/phone or password" },
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
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
