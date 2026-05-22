import { after } from "next/server";
import {
  buildBookingEmail,
  buildContactEmail,
  buildReviewEmail,
} from "@/lib/notifications/email-templates";
import { sendStudioEmail } from "@/lib/notifications/send-email";

/** Runs after the HTTP response — never blocks or throws to callers */
function scheduleStudioEmail(
  task: () => Promise<void>,
  logLabel: string,
): void {
  after(async () => {
    try {
      await task();
    } catch (e) {
      console.error(`[notify] ${logLabel}:`, e);
    }
  });
}

export function notifyNewReview(data: {
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  comment: string;
  reviewId: string;
}): void {
  scheduleStudioEmail(() => sendReviewEmail(data), "review email");
}

async function sendReviewEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  comment: string;
  reviewId: string;
}) {
  const email = buildReviewEmail(data);
  await sendStudioEmail(email);
}

export function notifyNewBooking(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  description: string;
  placement: string;
  size: string;
  scheduledAt?: Date | null;
  referenceImageUrls?: string[];
  bookingId: string;
}): void {
  scheduleStudioEmail(() => sendBookingEmail(data), "booking email");
}

async function sendBookingEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  description: string;
  placement: string;
  size: string;
  scheduledAt?: Date | null;
  referenceImageUrls?: string[];
  bookingId: string;
}) {
  const email = buildBookingEmail(data);
  await sendStudioEmail(email);
}

export function notifyContactInquiry(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}): void {
  scheduleStudioEmail(() => sendContactEmail(data), "contact email");
}

async function sendContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const email = buildContactEmail(data);
  await sendStudioEmail(email);
}
