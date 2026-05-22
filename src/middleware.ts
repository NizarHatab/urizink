import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requiresAdminApiAuth } from "@/lib/admin-api-routes";
import { getAdminPayloadFromRequest } from "@/lib/verify-admin-session";
import { authConfig } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (requiresAdminApiAuth(pathname, request.method)) {
    const admin = await getAdminPayloadFromRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    const admin = await getAdminPayloadFromRequest(request);
    if (admin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const admin = await getAdminPayloadFromRequest(request);
  if (!admin) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    if (!request.cookies.get(authConfig.cookieName)?.value) {
      return res;
    }
    res.cookies.delete(authConfig.cookieName);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/bookings",
    "/api/bookings/:path*",
    "/api/portfolio",
    "/api/portfolio/:path*",
    "/api/schedule",
    "/api/schedule/:path*",
    "/api/reviews/stats",
    "/api/reviews/:path*",
    "/api/health/db",
  ],
};
