/**
 * POST /api/contact
 *
 * Contact form delivery endpoint. The form on the landing page posts here
 * and the message is delivered to the business mailbox.
 *
 * Delivery strategy (most reliable path first):
 *   1. SMTP via nodemailer when CONTACT_SMTP_* environment variables are set
 *      (any provider: Gmail app password, Mailgun, Postmark, SES relay...).
 *   2. Mailto fallback: when SMTP is not configured the route returns a
 *      pre-composed mailto: URL pointing at CONTACT_TO and the client opens
 *      it in the visitor's mail client. The message is never lost.
 *
 * A honeypot field ("company_url") rejects bot submissions without user
 * friction, and every field is length/format capped before use.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTACT_TO = process.env.CONTACT_TO ?? "hello@another-horizon.eu";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  company: 120,
  message: 8000
} as const;

interface ContactPayload {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Honeypot. Real visitors never fill it; bots do. */
  company_url: string;
}

function clean(value: FormDataEntryValue | null, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function buildMailtoUrl(payload: ContactPayload): string {
  const subject = `Website contact: ${payload.name}${payload.company ? ` (${payload.company})` : ""}`;
  const body = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : "",
    "",
    payload.message
  ]
    .filter(Boolean)
    .join("\n");

  const url = new URL(`mailto:${CONTACT_TO}`);
  url.searchParams.set("subject", subject);
  url.searchParams.set("body", body);
  return url.toString();
}

export async function POST(request: Request): Promise<NextResponse> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const payload: ContactPayload = {
    name: clean(formData.get("name"), MAX_LENGTHS.name),
    email: clean(formData.get("email"), MAX_LENGTHS.email),
    company: clean(formData.get("company"), MAX_LENGTHS.company),
    message: clean(formData.get("message"), MAX_LENGTHS.message),
    company_url: clean(formData.get("company_url"), 400)
  };

  // Honeypot: silently accept bots so they learn nothing from the form.
  if (payload.company_url.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!payload.name || !EMAIL_RE.test(payload.email) || !payload.message) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email and a message." },
      { status: 400 }
    );
  }

  const smtpConfigured = Boolean(process.env.CONTACT_SMTP_HOST);
  if (smtpConfigured) {
    try {
      // Dynamic import keeps nodemailer out of the bundle when SMTP is unused.
      const nodemailer = (await import("nodemailer")).default;
      const transporter = nodemailer.createTransport({
        host: process.env.CONTACT_SMTP_HOST,
        port: Number(process.env.CONTACT_SMTP_PORT ?? 587),
        secure: process.env.CONTACT_SMTP_SECURE === "true",
        auth:
          process.env.CONTACT_SMTP_USER && process.env.CONTACT_SMTP_PASS
            ? { user: process.env.CONTACT_SMTP_USER, pass: process.env.CONTACT_SMTP_PASS }
            : undefined
      });

      const text = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.company ? `Company: ${payload.company}` : "",
        "",
        payload.message
      ]
        .filter(Boolean)
        .join("\n");

      await transporter.sendMail({
        from: process.env.CONTACT_SMTP_FROM ?? process.env.CONTACT_SMTP_USER,
        to: CONTACT_TO,
        replyTo: payload.email,
        subject: `Website contact: ${payload.name}${payload.company ? ` (${payload.company})` : ""}`,
        text
      });

      return NextResponse.json({ ok: true, delivered: "smtp" });
    } catch (cause) {
      console.error("[aetheris] contact email delivery failed, falling back to mailto", cause);
      // Fall through to the mailto fallback rather than dropping the message.
    }
  }

  return NextResponse.json({
    ok: true,
    delivered: "mailto",
    mailtoUrl: buildMailtoUrl(payload)
  });
}
