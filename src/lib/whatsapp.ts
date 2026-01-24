export type WhatsAppPayload = {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
};

export function sendToWhatsApp(data: WhatsAppPayload) {
  const text = `🔥 New Contact Request

👤 Name: ${data.firstName} ${data.lastName}
📧 Email: ${data.email}
📌 Subject: ${data.subject}

💬 Message:
${data.message}
  `;

  const encoded = encodeURIComponent(text);

  const phone = "96176734662"; // UrizInk WhatsApp number

  window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
}