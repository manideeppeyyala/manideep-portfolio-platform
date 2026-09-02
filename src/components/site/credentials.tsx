/**
 * Certifications and Testimonials.
 *
 * Certifications sit on a deep band in a three-column grid, mirroring the
 * reference's "funded work" flow — issuer, dates, credential ID and a
 * verification link where one exists.
 *
 * Each returns null when empty, so a disabled or unpopulated section never
 * leaves a blank band on the page.
 */

import { Award, ExternalLink, Quote, Star } from "lucide-react";
import type { Certification, Testimonial } from "@/lib/schema";
import { live, livePublished } from "@/lib/schema";
import { DarkCard, IconTile, SectionHeader, TagPill } from "@/components/ui";
import { formatDate, initials } from "@/lib/utils";
import { Reveal } from "./motion";

/* ------------------------------------------------------------------ */
/* Certifications — deep band                                          */
/* ------------------------------------------------------------------ */

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const items = live(certifications);
  if (!items.length) return null;

  return (
    <section
      id="certifications"
      className="bg-deep grid-bg relative isolate overflow-hidden section-y"
    >
      <div className="container-page relative">
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow="Certifications"
            title="Credentials & published research."
            description="Certifications from Anthropic and Databricks, workshops, and peer-reviewed work presented at IEEE."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((cert, index) => (
            <Reveal key={cert.id} delay={Math.min(index * 0.05, 0.3)}>
              <DarkCard className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <IconTile>
                    <Award size={22} aria-hidden />
                  </IconTile>
                  {cert.category && <TagPill>{cert.category}</TagPill>}
                </div>

                <h3 className="mt-5 text-base font-bold leading-snug text-primary-foreground">
                  {cert.title}
                </h3>

                {cert.issuer && (
                  <p className="mt-1.5 text-sm text-primary-foreground/60">{cert.issuer}</p>
                )}

                {(cert.issueDate || cert.expiryDate) && (
                  <p className="mt-1 text-xs text-primary-foreground/40">
                    {cert.issueDate && `Issued ${formatDate(cert.issueDate)}`}
                    {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                  </p>
                )}

                {cert.description && (
                  <p className="mt-4 text-sm leading-relaxed text-primary-foreground/55">
                    {cert.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  {cert.credentialId && (
                    <p className="truncate font-mono text-[11px] text-primary-foreground/35">
                      ID {cert.credentialId}
                    </p>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                    >
                      Verify
                      <ExternalLink size={13} aria-hidden />
                    </a>
                  )}
                </div>
              </DarkCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials — light band                                           */
/* ------------------------------------------------------------------ */

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const items = livePublished(testimonials);
  if (!items.length) return null;

  return (
    <section id="testimonials" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeader eyebrow="Testimonials" title="What people say." align="center" />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={Math.min(index * 0.06, 0.3)}>
              <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <Quote size={26} aria-hidden className="text-accent" />

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                  {item.quote}
                </blockquote>

                <div
                  className="mt-5 flex items-center gap-1"
                  role="img"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      size={13}
                      aria-hidden
                      className={i < item.rating ? "text-accent" : "text-border"}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-accent">
                    {initials(item.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-foreground">
                      {item.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[item.role, item.company].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
