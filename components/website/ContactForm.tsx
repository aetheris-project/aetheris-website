"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  /** Business inbox the form delivers to (shown on the success state). */
  inbox?: string;
}

/**
 * ContactForm
 *
 * Posts to /api/contact. When SMTP is configured server-side the message is
 * emailed directly; otherwise the API returns a pre-composed mailto URL that
 * is opened in the visitor's mail client so the message is never lost.
 */
export function ContactForm({ inbox = "hello@another-horizon.eu" }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      const payload = (await response.json()) as {
        ok: boolean;
        delivered?: "smtp" | "mailto";
        mailtoUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      // When SMTP is not configured the API hands back a mailto URL; opening
      // it in a new tab hands the message to the visitor's mail client.
      if (payload.delivered === "mailto" && payload.mailtoUrl) {
        window.open(payload.mailtoUrl, "_blank", "noopener,noreferrer");
      }

      setStatus("success");
      form.reset();
    } catch (cause) {
      console.error("[aetheris] contact form submission failed", cause);
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="aetheris-card flex flex-col items-center gap-4 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-semibold tracking-tight">Message ready to send</h3>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Your message has been prepared for {inbox}. If a mail window opened,
          just press send there - our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="aetheris-btn-secondary mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="aetheris-card space-y-4 p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-faint">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            maxLength={120}
            placeholder="Jane Doe"
            className="aetheris-input"
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-faint">
            Work email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="jane@company.com"
            className="aetheris-input"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-company" className="text-xs font-semibold uppercase tracking-wider text-faint">
          Company <span className="normal-case text-faint/60">(optional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          maxLength={120}
          placeholder="Acme Hosting"
          className="aetheris-input"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-faint">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={8000}
          rows={5}
          placeholder="Tell us about your infrastructure, timelines and goals..."
          className="aetheris-input h-auto resize-y py-3 leading-6"
        />
      </div>

      {/* Honeypot: hidden from visitors, attractive to bots. */}
      <input
        type="text"
        name="company_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "submitting"} className="aetheris-btn-primary h-11 px-6">
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send message
            </>
          )}
        </button>
        <p className="flex items-center gap-1.5 text-xs text-faint">
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          Delivered to {inbox}
        </p>
      </div>
    </form>
  );
}
