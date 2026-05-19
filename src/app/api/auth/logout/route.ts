import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth";

export async function POST() : Promise<NextResponse> {
  const response = NextResponse.json({ success: true });
  response.cookies.set(authConfig.cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
