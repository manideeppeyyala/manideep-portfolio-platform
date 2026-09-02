/**
 * Certifications, Services and Testimonials.
 *
 * Grouped because they share one card language; each is independently
 * toggleable from Admin → Sections and returns null when empty, so a
 * disabled or unpopulated section never leaves a blank band on the page.
 */

import { Award, ExternalLink, Quote, Star } from "lucide-react";
import type { Certification, Service, Testimonial } from "@/lib/schema";
import { live, livePublished } from "@/lib/schema";
import { DarkCard, IconTile, SectionHeader, TagPill } from "@/components/ui";
import { formatDate, initials } from "@/lib/utils";
import { Reveal } from "./motion";
import { ContentIcon } from "./content-icon";

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const items = live(certifications);
  if (!items.length) return null;

  return (
    <section
      id="certifications"
      className="section-y relative overflow-hidden bg-navy-900 text-primary-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-page relative">
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow="Certifications"
            title="Credentials & recognition."
            description="Certifications, workshops and published research."
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

                  {cert.category && (
                    <TagPill>{cert.category}</TagPill>
                  )}
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
/* Services                                                            */
/* ------------------------------------------------------------------ */

export function ServicesSection({ services }: { services: Service[] }) {
  const items = livePublished(services);
  if (!items.length) return null;

  return (
    <section id="services" className="section-y bg-muted/40">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Services"
            title="What I can help with."
            description="The kinds of problems I'm set up to solve."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index * 0.06, 0.3)}>
              <article className="group h-full rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary-glow/40 hover:shadow-lift">
                <IconTile>
                  <ContentIcon name={service.icon} size={22} />
                </IconTile>

                <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground">
                  {service.title}
                </h3>

                {service.description && (
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                )}

                {service.features.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2.5 text-sm text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const items = livePublished(testimonials);
  if (!items.length) return null;

  return (
    <section id="testimonials" className="section-y bg-background">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Testimonials"
            title="What people say."
            align="center"
          />
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
