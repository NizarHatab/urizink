import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

let redis: Redis | null = null;
let rateLimitDisabledLogged = false;

export function isRateLimitConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function getRedis(): Redis | null {
  if (!isRateLimitConfigured()) return null;
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

function createLimiter(
  prefix: string,
  requests: number,
  window: `${number} s` | `${number} m` | `${number} h` | `${number} d`,
): Ratelimit | null {
  const client = getRedis();
  if (!client) return null;
  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `urizink:${prefix}`,
    analytics: true,
  });
}

/** Per IP — review submissions */
const reviewIpHourly = createLimiter("reviews:ip:1h", 5, "1 h");
const reviewIpDaily = createLimiter("reviews:ip:24h", 15, "24 h");

/** Per email — review attempts (DB still enforces one review per user) */
const reviewEmailHourly = createLimiter("reviews:email:1h", 3, "1 h");

/** Per IP — booking requests */
const bookingIpHourly = createLimiter("bookings:ip:1h", 8, "1 h");
const bookingIpDaily = createLimiter("bookings:ip:24h", 25, "24 h");

/** Per email — booking requests */
const bookingEmailHourly = createLimiter("bookings:email:1h", 5, "1 h");

/** Per IP — contact form */
const contactIpHourly = createLimiter("contact:ip:1h", 5, "1 h");
const contactIpDaily = createLimiter("contact:ip:24h", 15, "24 h");

/** Per email — contact form */
const contactEmailHourly = createLimiter("contact:email:1h", 3, "1 h");

export type RateLimitDenied = {
  ok: false;
  retryAfterSec: number;
  message: string;
};

type LimitCheck = {
  limiter: Ratelimit | null;
  id: string;
};

async function runChecks(
  checks: LimitCheck[],
): Promise<{ ok: true } | RateLimitDenied> {
  const active = checks.filter((c) => c.limiter);
  if (active.length === 0) {
    if (process.env.NODE_ENV === "production" && !rateLimitDisabledLogged) {
      rateLimitDisabledLogged = true;
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — public POST limits are disabled.",
      );
    }
    return { ok: true };
  }

  try {
    for (const { limiter, id } of active) {
      const { success, reset } = await limiter!.limit(id);
      if (!success) {
        const retryAfterSec = Math.max(
          1,
          Math.ceil((reset - Date.now()) / 1000),
        );
        return {
          ok: false,
          retryAfterSec,
          message: "Too many requests. Please wait a few minutes and try again.",
        };
      }
    }
  } catch (error) {
    // Fail open: never block bookings/reviews/contact when Redis is down or misconfigured.
    console.error("[rate-limit] Upstash check failed — allowing request:", error);
    return { ok: true };
  }

  return { ok: true };
}

export async function checkReviewIpLimits(
  ip: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([
    { limiter: reviewIpHourly, id: ip },
    { limiter: reviewIpDaily, id: ip },
  ]);
}

export async function checkReviewEmailLimits(
  email: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([{ limiter: reviewEmailHourly, id: email }]);
}

export async function checkBookingIpLimits(
  ip: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([
    { limiter: bookingIpHourly, id: ip },
    { limiter: bookingIpDaily, id: ip },
  ]);
}

export async function checkBookingEmailLimits(
  email: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([{ limiter: bookingEmailHourly, id: email }]);
}

export async function checkContactIpLimits(
  ip: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([
    { limiter: contactIpHourly, id: ip },
    { limiter: contactIpDaily, id: ip },
  ]);
}

export async function checkContactEmailLimits(
  email: string,
): Promise<{ ok: true } | RateLimitDenied> {
  return runChecks([{ limiter: contactEmailHourly, id: email }]);
}

export function rateLimitResponse(denied: RateLimitDenied): NextResponse {
  return NextResponse.json(
    { error: denied.message },
    {
      status: 429,
      headers: {
        "Retry-After": String(denied.retryAfterSec),
      },
    },
  );
}
