import { durationMinutesFromSize } from "@/lib/booking-duration";
import { getSiteBaseUrl } from "@/lib/notifications/config";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fullName(first: string, last: string): string {
  return [first, last].filter(Boolean).join(" ").trim() || "Unknown";
}

function starsHtml(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filledStar = i < filled;
    return `<span style="color:${filledStar ? "#ffffff" : "#404040"};font-size:18px;line-height:1;">★</span>`;
  }).join("");
  return `<span aria-label="${filled} out of 5 stars">${stars}</span>`;
}

type EmailLayoutOptions = {
  preheader: string;
  badge: string;
  title: string;
  subtitle?: string;
  bodyHtml: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCta?: { label: string; url: string };
  footerNote?: string;
};

function studioEmailLayout(options: EmailLayoutOptions): string {
  const site = getSiteBaseUrl();
  const preheader = escapeHtml(options.preheader);
  const badge = escapeHtml(options.badge);
  const title = escapeHtml(options.title);
  const subtitle = options.subtitle ? escapeHtml(options.subtitle) : "";
  const ctaLabel = escapeHtml(options.ctaLabel);
  const ctaUrl = escapeHtml(options.ctaUrl);
  const footerNote = escapeHtml(
    options.footerNote ?? "UrizInk studio notification — reply from your inbox or open admin.",
  );

  const secondaryCtaRow = options.secondaryCta
    ? `<tr>
        <td align="center" style="padding:0 32px 8px;">
          <a href="${escapeHtml(options.secondaryCta.url)}" style="color:#a3a3a3;font-size:13px;text-decoration:underline;">${escapeHtml(options.secondaryCta.label)}</a>
        </td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${title}</title>
  <!--[if mso]><style type="text/css">body,table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#050505;color:#fafafa;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#050505;margin:0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;margin:0 auto;">
          <tr>
            <td style="padding:0 0 20px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;letter-spacing:0.22em;color:#ffffff;">URIZINK</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.35em;color:#737373;margin-top:8px;text-transform:uppercase;">Blackwork · Beirut</div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0a0a0a;border:1px solid #262626;border-radius:2px;overflow:hidden;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:28px 32px 8px;border-bottom:1px solid #1f1f1f;">
                    <div style="display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.28em;text-transform:uppercase;color:#050505;background-color:#ffffff;padding:8px 12px;border-radius:2px;">${badge}</div>
                    <h1 style="margin:18px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.15;font-weight:700;color:#ffffff;">${title}</h1>
                    ${subtitle ? `<p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#a3a3a3;">${subtitle}</p>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px 8px;">
                    ${options.bodyHtml}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px 32px 28px;">
                    <a href="${ctaUrl}" style="display:inline-block;background-color:#ffffff;color:#050505;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:16px 28px;border-radius:2px;">${ctaLabel}</a>
                  </td>
                </tr>
                ${secondaryCtaRow}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#525252;">
              ${footerNote}<br />
              <a href="${escapeHtml(site)}" style="color:#737373;text-decoration:underline;">${escapeHtml(site.replace(/^https?:\/\//, ""))}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string, opts?: { link?: string }): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value);
  const valueHtml = opts?.link
    ? `<a href="${escapeHtml(opts.link)}" style="color:#ffffff;text-decoration:underline;">${safeValue}</a>`
    : safeValue;

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:12px;">
    <tr>
      <td style="padding:14px 16px;background-color:#111111;border:1px solid #1f1f1f;border-radius:2px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#737373;margin-bottom:6px;">${safeLabel}</div>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#fafafa;word-break:break-word;">${valueHtml}</div>
      </td>
    </tr>
  </table>`;
}

function quoteBlock(label: string, content: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:12px;">
    <tr>
      <td style="padding:18px 18px 18px 20px;background-color:#111111;border-left:3px solid #ffffff;border:1px solid #1f1f1f;border-radius:2px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#737373;margin-bottom:10px;">${escapeHtml(label)}</div>
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.65;color:#e5e5e5;white-space:pre-wrap;">${escapeHtml(content.trim())}</div>
      </td>
    </tr>
  </table>`;
}

function referenceImagesHtml(urls: string[]): string {
  if (!urls.length) return "";
  const items = urls
    .map(
      (url, i) =>
        `<tr><td style="padding:8px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;"><a href="${escapeHtml(url)}" style="color:#ffffff;text-decoration:underline;">Reference ${i + 1}</a></td></tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:12px;">
    <tr>
      <td style="padding:14px 16px;background-color:#111111;border:1px solid #1f1f1f;border-radius:2px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#737373;margin-bottom:8px;">Reference images</div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${items}</table>
      </td>
    </tr>
  </table>`;
}

export function buildReviewEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  comment: string;
  reviewId: string;
}) {
  const site = getSiteBaseUrl();
  const name = fullName(data.firstName, data.lastName);
  const adminUrl = `${site}/admin/reviews`;

  const text = `New review on UrizInk

Name: ${name}
Email: ${data.email}
Rating: ${data.rating}/5

Comment:
${data.comment.trim()}

Open admin: ${adminUrl}`;

  const bodyHtml = [
    detailRow("Client", name),
    detailRow("Email", data.email, { link: `mailto:${data.email}` }),
    `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:12px;">
      <tr>
        <td style="padding:14px 16px;background-color:#111111;border:1px solid #1f1f1f;border-radius:2px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#737373;margin-bottom:8px;">Rating</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#fafafa;">${starsHtml(data.rating)} <span style="margin-left:8px;color:#a3a3a3;">${data.rating}/5</span></div>
        </td>
      </tr>
    </table>`,
    quoteBlock("Review", data.comment),
  ].join("");

  const html = studioEmailLayout({
    preheader: `New ${data.rating}★ review from ${name}`,
    badge: "New review",
    title: `${name} left a review`,
    subtitle: "A new client review was submitted on your public site.",
    bodyHtml,
    ctaLabel: "View all reviews",
    ctaUrl: adminUrl,
    secondaryCta: { label: "Reply to client", url: `mailto:${data.email}` },
  });

  return {
    subject: `New review — ${data.rating}★ from ${name}`,
    text,
    html,
  };
}

export function buildBookingEmail(data: {
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
  const site = getSiteBaseUrl();
  const name = fullName(data.firstName, data.lastName);
  const adminUrl = `${site}/admin/bookings/${data.bookingId}`;
  const mins = durationMinutesFromSize(data.size);
  const duration =
    mins >= 60 ? `${Math.round(mins / 60)} hr` : `${mins} min`;

  let slot = "To be scheduled — no slot selected on the website";
  if (data.scheduledAt && !isNaN(data.scheduledAt.getTime())) {
    slot = data.scheduledAt.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Beirut",
    });
  }

  const refs = (data.referenceImageUrls ?? []).filter(Boolean);
  const refsText =
    refs.length > 0
      ? `\n\nReference images:\n${refs.map((u, i) => `${i + 1}. ${u}`).join("\n")}`
      : "";

  const text = `New booking request on UrizInk

Client: ${name}
Email: ${data.email}
Phone: ${data.phone?.trim() || "—"}

Tattoo idea:
${data.description.trim()}

Placement: ${data.placement}
Size: ${data.size} (~${duration})

Preferred slot:
${slot}${refsText}

Open booking: ${adminUrl}`;

  const bodyHtml = [
    detailRow("Client", name),
    detailRow("Email", data.email, { link: `mailto:${data.email}` }),
    detailRow("Phone", data.phone?.trim() || "Not provided", {
      link: data.phone?.trim() ? `tel:${data.phone.trim()}` : undefined,
    }),
    quoteBlock("Tattoo idea", data.description),
    detailRow("Placement", data.placement),
    detailRow("Size", `${data.size} · ~${duration}`),
    detailRow("Preferred session", slot),
    referenceImagesHtml(refs),
  ].join("");

  const html = studioEmailLayout({
    preheader: `New booking request from ${name}`,
    badge: "New booking",
    title: `${name} requested a session`,
    subtitle: "Review the details below and confirm or follow up from admin.",
    bodyHtml,
    ctaLabel: "Open booking",
    ctaUrl: adminUrl,
    secondaryCta: { label: "Email client", url: `mailto:${data.email}` },
  });

  return {
    subject: `New booking — ${name}`,
    text,
    html,
  };
}

export function buildContactEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const site = getSiteBaseUrl();
  const name = fullName(data.firstName, data.lastName);
  const subjectLine = data.subject.trim();

  const text = `New contact message on UrizInk

Name: ${name}
Email: ${data.email}
Subject: ${subjectLine}

Message:
${data.message.trim()}

Reply: mailto:${data.email}`;

  const bodyHtml = [
    detailRow("From", name),
    detailRow("Email", data.email, { link: `mailto:${data.email}` }),
    detailRow("Subject", subjectLine),
    quoteBlock("Message", data.message),
  ].join("");

  const html = studioEmailLayout({
    preheader: `Contact: ${subjectLine} from ${name}`,
    badge: "Contact form",
    title: subjectLine,
    subtitle: `${name} sent a message through your website contact page.`,
    bodyHtml,
    ctaLabel: "Reply to client",
    ctaUrl: `mailto:${data.email}?subject=${encodeURIComponent(`Re: ${subjectLine}`)}`,
    secondaryCta: { label: "Open website", url: site },
  });

  return {
    subject: `Contact — ${subjectLine} (${name})`,
    text,
    html,
  };
}
