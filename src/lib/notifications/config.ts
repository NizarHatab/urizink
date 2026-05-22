/** Studio inbox for new review / booking / contact alerts */
export function getNotifyToEmail(): string | null {
  const to =
    process.env.NOTIFY_EMAIL_TO?.trim() ||
    process.env.STUDIO_NOTIFY_EMAIL?.trim();
  return to || null;
}

export function getNotifyFromEmail(): string {
  return (
    process.env.NOTIFY_EMAIL_FROM?.trim() ||
    "UrizInk <onboarding@resend.dev>"
  );
}

export function isEmailNotifyConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && getNotifyToEmail());
}

export function getSiteBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
