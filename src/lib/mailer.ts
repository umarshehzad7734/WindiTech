import { business } from "@/content/site";
import type { ContactInput } from "./validation";

/**
 * Two delivery paths are implemented so you can use whichever your host
 * supports:
 *
 *   MAIL_TRANSPORT=resend  → Resend HTTP API (preferred; works on serverless)
 *   MAIL_TRANSPORT=smtp    → Nodemailer over SMTP (works on cPanel/shared hosts)
 *
 * If MAIL_TRANSPORT is unset we pick whichever one is fully configured,
 * preferring Resend. See README.md and .env.example.
 */

export type MailResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "send-failed"; detail: string };

type Transport = "resend" | "smtp";

function resolveTransport(): Transport | null {
  const explicit = process.env.MAIL_TRANSPORT?.trim().toLowerCase();
  if (explicit === "resend") return process.env.RESEND_API_KEY ? "resend" : null;
  if (explicit === "smtp") return process.env.SMTP_HOST ? "smtp" : null;

  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST) return "smtp";
  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMessage(input: ContactInput) {
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company?.trim() || "—"],
    ["Phone", input.phone?.trim() || "—"],
    ["Subject", input.subject],
  ];

  const text = [
    `New enquiry from ${business.domain}`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en"><body style="margin:0;background:#f4f7f8;padding:24px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b0f12">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #cfd8de;border-radius:12px;overflow:hidden">
    <div style="background:#060809;padding:20px 24px">
      <p style="margin:0;color:#00e38c;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">New website enquiry</p>
      <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:600">${escapeHtml(business.name)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) => `<tr>
        <td style="padding:12px 24px;border-bottom:1px solid #e6ecef;color:#556672;width:110px;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:12px 24px;border-bottom:1px solid #e6ecef;color:#0b0f12;font-weight:500">${escapeHtml(value)}</td>
      </tr>`,
        )
        .join("")}
    </table>
    <div style="padding:20px 24px">
      <p style="margin:0 0 8px;color:#556672;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">Message</p>
      <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>
  </div>
  <p style="max-width:600px;margin:16px auto 0;color:#7a8b96;font-size:12px">Sent from the contact form on ${escapeHtml(business.domain)}.</p>
</body></html>`;

  return {
    subject: `[${business.domain}] ${input.subject}`,
    text,
    html,
  };
}

export async function sendContactEmail(
  input: ContactInput,
): Promise<MailResult> {
  const transport = resolveTransport();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || business.email;
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    `${business.name} <no-reply@${business.domain}>`;

  if (!transport) {
    return {
      ok: false,
      reason: "not-configured",
      detail:
        "No mail transport configured. Set RESEND_API_KEY, or SMTP_HOST and its companion variables.",
    };
  }

  const message = buildMessage(input);

  try {
    if (transport === "resend") {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: input.email,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
      if (error) {
        return { ok: false, reason: "send-failed", detail: error.message };
      }
      return { ok: true };
    }

    const nodemailer = (await import("nodemailer")).default;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // Implicit TLS on 465; STARTTLS on 587/25.
      secure: process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE === "true"
        : port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: input.email,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "send-failed",
      detail: error instanceof Error ? error.message : "Unknown mail error.",
    };
  }
}
