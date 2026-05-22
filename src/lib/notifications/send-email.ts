import { Resend } from "resend";
import {
  getNotifyFromEmail,
  getNotifyToEmail,
  isEmailNotifyConfigured,
} from "@/lib/notifications/config";

let resend: Resend | null = null;
let emailSkipLogged = false;

function getResend(): Resend | null {
  if (!isEmailNotifyConfigured()) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY!.trim());
  }
  return resend;
}

export async function sendStudioEmail(options: {
  subject: string;
  text: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  const client = getResend();
  const to = getNotifyToEmail();
  if (!client || !to) {
    if (process.env.NODE_ENV === "development" && !emailSkipLogged) {
      emailSkipLogged = true;
      console.warn(
        "[notify-email] Skipped — set RESEND_API_KEY and NOTIFY_EMAIL_TO in .env.local",
      );
    }
    return { sent: false, error: "Email notifications not configured" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: getNotifyFromEmail(),
      to: [to],
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    if (error) {
      console.error("[notify-email] Failed:", error);
      return { sent: false, error: error.message };
    }
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[notify-email] Sent "${options.subject}" → ${to}${data?.id ? ` (id: ${data.id})` : ""}`,
      );
    }
    return { sent: true };
  } catch (e) {
    console.error("[notify-email]", e);
    return {
      sent: false,
      error: e instanceof Error ? e.message : "Send failed",
    };
  }
}
