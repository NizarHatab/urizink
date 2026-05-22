import { NextResponse } from "next/server";
import { getClientIp, normalizeRateLimitKey } from "@/lib/client-ip";
import { notifyContactInquiry } from "@/lib/notifications/notify-studio";
import {
  checkContactEmailLimits,
  checkContactIpLimits,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { contactCreateSchema } from "@/lib/validators/contact";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = await checkContactIpLimits(ip);
    if (!ipLimit.ok) return rateLimitResponse(ipLimit);

    const body = await req.json();
    const parsed = contactCreateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Validation failed" },
        { status: 400 },
      );
    }

    const emailKey = normalizeRateLimitKey(parsed.data.email);
    const emailLimit = await checkContactEmailLimits(emailKey);
    if (!emailLimit.ok) return rateLimitResponse(emailLimit);

    notifyContactInquiry(parsed.data);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("CONTACT_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
