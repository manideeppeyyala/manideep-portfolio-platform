"use client";

/**
 * Contact section.
 *
 * The form has four honest states — idle, submitting, success, error —
 * and validates client-side purely for fast feedback. The server validates
 * again with the same zod schema and is the only authority; a bypassed
 * client can't write a malformed message.
 *
 * Spam handling: a hidden honeypot field (`website`) plus server-side rate
 * limiting. No CAPTCHA, which would mean a third-party script and a
 * privacy trade-off for a personal portfolio's traffic volume.
 */

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import type { Contact, SiteSettings, SocialLink } from "@/lib/schema";
import { live } from "@/lib/schema";
import { Button, SectionHeader, StatusDot } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { SocialIcon } from "./social-icon";

type FormState = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactSection({
  contact,
  settings,
  socials,
}: {
  contact: Contact;
  settings: SiteSettings;
  socials: SocialLink[];
}) {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  const visibleSocials = live(socials);

  function validate(data: Record<string, string>): FieldErrors {
    const next: FieldErrors = {};
    if (data.name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Please enter a valid email";
    if (data.message.trim().length < 10)
      next.message = "Message must be at least 10 characters";
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""), // honeypot
    };

    const found = validate(payload);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setState("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setServerError(body.error ?? "Something went wrong. Please try again.");
        setState("error");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setState("error");
    }
  }

  const details = [
    settings.email && { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.whatsapp || settings.phone}` },
    settings.location && { icon: MapPin, label: "Location", value: settings.location, href: "" },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[];

  const inputClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground",
      "placeholder:text-muted-foreground/60 transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-accent/40",
      hasError ? "border-destructive" : "border-border focus:border-primary-glow"
    );

  return (
    <section id="contact" className="section-y bg-background">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow={contact.eyebrow}
            title={contact.heading}
            description={contact.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* ---- Details ---- */}
          <Reveal delay={0.08}>
            <div className="space-y-4">
              {settings.availabilityStatus && (
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 shadow-card">
                  <StatusDot active={settings.availabilityOpen} />
                  <span className="text-sm font-semibold text-foreground">
                    {settings.availabilityStatus}
                  </span>
                </div>
              )}

              <ul className="space-y-3">
                {details.map((item) => (
                  <li key={item.label}>
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-accent">
                        <item.icon size={18} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {item.label}
                        </span>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="block truncate text-sm font-medium text-foreground hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <span className="block truncate text-sm font-medium text-foreground">
                            {item.value}
                          </span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {settings.responseTime && (
                <p className="text-sm text-muted-foreground">{settings.responseTime}</p>
              )}

              {visibleSocials.length > 0 && (
                <ul className="flex flex-wrap gap-2.5 pt-2">
                  {visibleSocials.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.url}
                        target={social.url.startsWith("http") ? "_blank" : undefined}
                        rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={social.label || social.platform}
                        className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/50 hover:text-primary"
                      >
                        <SocialIcon name={social.icon || social.platform} size={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>

          {/* ---- Form ---- */}
          {contact.formEnabled && (
            <Reveal delay={0.14}>
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
                {state === "success" ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success">
                      <CheckCircle2 size={30} aria-hidden />
                    </span>
                    <p className="mt-5 text-lg font-bold text-foreground">Message sent</p>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      {contact.successMessage}
                    </p>
                    <Button
                      variant="outline"
                      className="mt-7 border-border"
                      onClick={() => setState("idle")}
                    >
                      Send another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Honeypot — visually and programmatically hidden from humans */}
                    <div aria-hidden className="absolute h-0 w-0 overflow-hidden">
                      <label htmlFor="website">Leave this field empty</label>
                      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">
                          Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          className={inputClass(Boolean(errors.name))}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p id="name-error" className="mt-1.5 text-xs text-destructive">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          className={inputClass(Boolean(errors.email))}
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p id="email-error" className="mt-1.5 text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-2 block text-sm font-semibold text-foreground">
                        Subject
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        className={inputClass(false)}
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-semibold text-foreground">
                        Message <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        className={cn(inputClass(Boolean(errors.message)), "resize-y")}
                        placeholder="Tell me about the role, project or idea…"
                      />
                      {errors.message && (
                        <p id="message-error" className="mt-1.5 text-xs text-destructive">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {state === "error" && serverError && (
                      <p
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                      >
                        <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
                        {serverError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={state === "submitting"}
                    >
                      {state === "submitting" ? (
                        <>
                          <Loader2 size={17} aria-hidden className="animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} aria-hidden />
                          Send message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
