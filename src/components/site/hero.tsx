"use client";

/**
 * Hero.
 *
 * Composition mirrors the reference design's DNA: navy gradient field,
 * constellation particles, an eyebrow pill, an oversized black-weight
 * headline with a gold gradient on the accent word, a rotating role line,
 * and a three-tier CTA hierarchy — then the portrait.
 *
 * Every string and image here comes from the CMS.
 */

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Hero as HeroContent, Resume, SocialLink } from "@/lib/schema";
import { buttonClass, EyebrowPill } from "@/components/ui";
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
      if (done) {
        setDeleting(true);
      } else if (cleared) {
        setDeleting(false);
        setIndex((i) => (i + 1) % roles.length);
      } else {
        setText((current) =>
          deleting ? full.slice(0, current.length - 1) : full.slice(0, current.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, roles, reduced]);

  if (reduced || roles.length <= 1) {
    return <span>{roles.join(" · ")}</span>;
  }

  return (
    <span>
      <span aria-live="polite">{text}</span>
      <span aria-hidden className="ml-0.5 inline-block w-0.5 animate-pulse-dot bg-accent align-middle" style={{ height: "1em" }} />
    </span>
  );
}

export function Hero({
  hero,
  socials,
  resume,
}: {
  hero: HeroContent;
  socials: SocialLink[];
  resume: Resume;
}) {
  const ctas = [
    { label: hero.primaryCtaLabel, href: hero.primaryCtaHref, variant: "primary" as const, icon: true },
    { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref, variant: "outline" as const, icon: false },
    { label: hero.tertiaryCtaLabel, href: hero.tertiaryCtaHref, variant: "outline" as const, icon: false },
  ].filter((c) => c.label && c.href);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-gradient-hero text-primary-foreground"
    >
      {/* Constellation field */}
      {hero.showParticles && (
        {/*
          Full opacity: the canvas already tunes its own alpha per element
          (ambient links are faint, cursor links are bright). Dimming the
          whole layer here muted the cursor interaction that's meant to be
          the noticeable part.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <Particles />
        </div>
      )}

      {/* Grid wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div className="container-page grid items-center gap-14 pb-20 pt-32 md:pb-28 md:pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-32 lg:pt-44">
        {/* ---- Copy ---- */}
        <div>
          {hero.eyebrow && (
            <Entrance delay={0.05}>
              <EyebrowPill>{hero.eyebrow}</EyebrowPill>
            </Entrance>
          )}

          <Entrance delay={0.14}>
            <h1 className="mt-6 text-[clamp(2.75rem,7vw,4.75rem)] font-black leading-[1.03] tracking-[-0.03em]">
              {hero.name}{" "}
              {hero.nameAccent && (
                <span className="text-gradient-gold">{hero.nameAccent}</span>
              )}
            </h1>
          </Entrance>

          {hero.titles.length > 0 && (
            <Entrance delay={0.22}>
              <p className="mt-5 text-xl font-medium text-primary-foreground/85 sm:text-2xl">
                <RoleTicker roles={hero.titles} />
              </p>
            </Entrance>
          )}

          {hero.intro && (
            <Entrance delay={0.3}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/65">
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
              <ul className="mt-10 flex flex-wrap items-center gap-3">
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

        {/* ---- Portrait ---- */}
        {hero.image && (
          <Entrance delay={0.3} y={36} className="justify-self-center lg:justify-self-end">
            <div className="group relative">
              <div
                aria-hidden
                className="absolute -inset-5 rounded-[2.5rem] bg-gradient-gold opacity-15 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
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
    </section>
  );
}
