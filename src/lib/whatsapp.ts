import {
  durationMinutesFromSize,
  formatDurationLabel,
} from "@/lib/booking-duration";

/** E.164 without + — e.g. 96176734662 */
function getWhatsAppPhone(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE?.trim().replace(/\D/g, "") ||
    "96176734662";
  return raw;
}

/** Set NEXT_PUBLIC_ENABLE_WHATSAPP=false to hide optional WhatsApp prompts */
export function isWhatsAppEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_WHATSAPP !== "false";
}

export type ContactWhatsAppPayload = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export type BookingWhatsAppPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  placement: string;
  size: string;
  date?: string;
  time?: string;
  referenceImageUrls?: string[];
};

export function buildWhatsAppUrl(text: string): string {
  const encoded = encodeURIComponent(text.trim());
  return `https://wa.me/${getWhatsAppPhone()}?text=${encoded}`;
}

function openWhatsApp(text: string) {
  if (!isWhatsAppEnabled()) return;
  window.open(buildWhatsAppUrl(text), "_blank", "noopener,noreferrer");
}

/** Contact page — general inquiry layout */
export function sendContactToWhatsApp(data: ContactWhatsAppPayload) {
  if (!isWhatsAppEnabled()) return;

  const text = `🔥 New Contact Request

👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
📌 Subject: ${data.subject}

💬 Message:
${data.message}`;

  openWhatsApp(text);
}

/** @deprecated Use sendContactToWhatsApp */
export const sendToWhatsApp = sendContactToWhatsApp;

/** Booking page — session request layout */
export function sendBookingToWhatsApp(data: BookingWhatsAppPayload) {
  if (!isWhatsAppEnabled()) return;

  const duration = formatDurationLabel(durationMinutesFromSize(data.size));

  let slotSection: string;
  if (data.date?.trim() && data.time?.trim()) {
    const parsed = new Date(`${data.date.trim()}T${data.time.trim()}:00`);
    const formatted = Number.isNaN(parsed.getTime())
      ? `${data.date} at ${data.time}`
      : parsed.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        });
    slotSection = `🗓 Preferred slot:\n${formatted}`;
  } else {
    slotSection = `🗓 Session time:\nTo be scheduled — no slot selected on the site`;
  }

  const text = `📅 New Booking Request

━━━━━━━━━━━━━━━━
👤 Client
${data.firstName} ${data.lastName}
📧 ${data.email}
📱 ${data.phone}

🎨 Tattoo idea
${data.description}

📍 Placement: ${data.placement}
📏 Size: ${data.size} (~${duration})

${slotSection}${
    data.referenceImageUrls?.length
      ? `\n\n🖼 Reference images (${data.referenceImageUrls.length}):\n${data.referenceImageUrls.map((url, i) => `${i + 1}. ${url}`).join("\n")}`
      : ""
  }
━━━━━━━━━━━━━━━━
Sent via UrizInk booking form`;

  openWhatsApp(text);
}
