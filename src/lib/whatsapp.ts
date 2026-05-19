import {
  durationMinutesFromSize,
  formatDurationLabel,
} from "@/lib/booking-duration";

const WHATSAPP_PHONE = "96176734662";

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
};

function openWhatsApp(text: string) {
  const encoded = encodeURIComponent(text.trim());
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, "_blank");
}

/** Contact page — general inquiry layout */
export function sendContactToWhatsApp(data: ContactWhatsAppPayload) {
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

${slotSection}
━━━━━━━━━━━━━━━━
Sent via UrizInk booking form`;

  openWhatsApp(text);
}
