"use client";

/**
 * Hero — full-viewport deep band, two columns, stat strip beneath.
 *
 * Composition follows the reference flow exactly: pill badge → oversized
 * black-weight headline with a gradient on the surname → role line →
 * intro → CTA row → portrait, then a bordered stat strip spanning the
 * width as the transition into the page.
 *
 * Every string, number and image comes from the CMS.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Hero as HeroContent, Resume, SocialLink, Stat } from "@/lib/schema";
import { buttonClass } from "@/components/ui";
import { Entrance } from "./motion";
import { Particles } from "./particles";
import { SocialIcon } from "./social-icon";

/** Cycles roles with a typewriter effect; static under reduced motion. */
function RoleTicker({ roles }: { roles: string[] }) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(roles[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced || roles.length <= 1) return;

    const full = roles[index % roles.length];
    const done = !deleting && text === full;
    const cleared = deleting && text === "";
    const delay = done ? 1900 : cleared ? 240 : deleting ? 34 : 62;

    const timer = setTimeout(() => {
      if (done) setDeleting(true);
      else if (cleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else {
        setText((c) => (deleting ? full.slice(0, c.length - 1) : full.slice(0, c.length + 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, roles, reduced]);

  if (reduced || roles.length <= 1) return <span>{roles.join(" · ")}</span>;

  return (
    <span>
      <span aria-live="polite">{text}</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block w-0.5 animate-pulse-dot bg-accent align-middle"
        style={{ height: "1em" }}
      />
    </span>
  );
}

export function Hero({
  hero,
  socials,
  resume,
  stats,
}: {
  hero: HeroContent;
  socials: SocialLink[];
  resume: Resume;
  stats: Stat[];
}) {
  const ctas = [
    { label: hero.primaryCtaLabel, href: hero.primaryCtaHref, variant: "primary" as const, icon: true },
    { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref, variant: "outline" as const, icon: false },
    { label: hero.tertiaryCtaLabel, href: hero.tertiaryCtaHref, variant: "outline" as const, icon: false },
  ].filter((c) => c.label && c.href);

  return (
    <section id="top" className="bg-deep grid-bg relative isolate overflow-hidden">
      {/* Constellation field — cursor-reactive */}
      {hero.showParticles && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Particles />
        </div>
      )}

      {/* ---- Main two-column band ---- */}
      <div className="container-page relative grid items-center gap-12 pb-20 pt-32 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-44">
        <div>
          {hero.eyebrow && (
            <Entrance delay={0.05}>
              <span className="glass-dark inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
                {hero.eyebrow}
              </span>
            </Entrance>
          )}

          <Entrance delay={0.14}>
            <h1 className="relative mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {hero.name}{" "}
              {hero.nameAccent && <span className="text-gradient-gold">{hero.nameAccent}</span>}

              {/* Decorative glints around the headline */}
              <span
                aria-hidden
                className="sparkle -right-2 -top-3"
                style={{ "--sparkle-size": "22px", "--twinkle-duration": "3.6s" } as React.CSSProperties}
              />
              <span
                aria-hidden
                className="sparkle right-10 top-14"
                style={
                  {
                    "--sparkle-size": "13px",
                    "--twinkle-delay": "1.1s",
                    "--sparkle-color": "var(--color-glint-cyan)",
                  } as React.CSSProperties
                }
              />
              <span
                aria-hidden
                className="sparkle -left-5 top-8"
                style={
                  {
                    "--sparkle-size": "11px",
                    "--twinkle-delay": "2s",
                    "--sparkle-color": "var(--color-glint-amber)",
                  } as React.CSSProperties
                }
              />
            </h1>
          </Entrance>

          {hero.titles.length > 0 && (
            <Entrance delay={0.22}>
              <p className="mt-5 max-w-xl text-lg text-primary-foreground/80 sm:text-xl">
                <RoleTicker roles={hero.titles} />
              </p>
            </Entrance>
          )}

          {hero.intro && (
            <Entrance delay={0.3}>
              <p className="mt-6 max-w-xl leading-relaxed text-primary-foreground/60">
                {hero.intro}
              </p>
            </Entrance>
          )}

          {(ctas.length > 0 || (resume.enabled && resume.fileUrl)) && (
            <Entrance delay={0.38}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {ctas.map((cta) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={buttonClass(
                      cta.variant,
                      "md",
                      cta.variant === "outline"
                        ? "border-white/25 text-primary-foreground hover:bg-white/10"
                        : undefined
                    )}
                  >
                    {cta.label}
                    {cta.icon && <ArrowRight size={17} aria-hidden />}
                  </a>
                ))}

                {resume.enabled && resume.fileUrl && (
                  <a
                    href={resume.fileUrl}
                    download={resume.fileName || undefined}
                    className={buttonClass(
                      "ghost",
                      "md",
                      "text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground"
                    )}
                  >
                    <Download size={16} aria-hidden />
                    {resume.buttonLabel}
                  </a>
                )}
              </div>
            </Entrance>
          )}

          {hero.showSocials && socials.length > 0 && (
            <Entrance delay={0.46}>
              <ul className="mt-9 flex flex-wrap items-center gap-3">
                {socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target={social.url.startsWith("http") ? "_blank" : undefined}
                      rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={social.label || social.platform}
                      title={social.label || social.platform}
                      className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-primary-foreground/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:text-accent"
                    >
                      <SocialIcon name={social.icon || social.platform} size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            </Entrance>
          )}
        </div>

        {/* Portrait */}
        {hero.image && (
          <Entrance delay={0.3} y={36} className="justify-self-center lg:justify-self-end">
            <div className="group relative">
              <div
                aria-hidden
                className="animate-halo absolute -inset-5 rounded-[2.5rem] bg-gradient-gold blur-3xl"
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-elegant">
                <Image
                  src={hero.image}
                  alt={hero.imageAlt || "Portrait"}
                  width={480}
                  height={600}
                  priority
                  sizes="(max-width: 1024px) 78vw, 420px"
                  className="h-auto w-[min(78vw,420px)] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent"
                />
              </div>
            </div>
          </Entrance>
        )}
      </div>

      {/* ---- Stat strip ---- */}
      {stats.length > 0 && (
        <Entrance delay={0.5}>
          <div className="relative border-t border-white/10">
            <dl className="container-page grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((stat, index) => (
                <div key={stat.id} className="text-center">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-3xl font-black tracking-tight text-accent sm:text-4xl [animation-delay:var(--d)] animate-blink" style={{ "--d": `${index * 0.35}s` } as React.CSSProperties}>
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-primary-foreground/50">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Entrance>
      )}
    </section>
  );
}
