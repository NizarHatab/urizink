import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const COOKIE_NAME = "urizink_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET ?? "urizink-admin-secret-change-in-production"
        );
        await jose.jwtVerify(token, secret);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // token invalid, allow login page
      }
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? "urizink-admin-secret-change-in-production"
    );
    const { payload } = await jose.jwtVerify(token, secret);
    if (!payload.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
