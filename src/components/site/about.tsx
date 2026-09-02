/**
 * About — light band, two columns.
 *
 * Left: a portrait card. Right: the narrative, then a wrapped row of
 * credential pills. Stats live in the hero strip, not here, so this
 * section stays a single clear read.
 */

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { About as AboutContent } from "@/lib/schema";
import { buttonClass, SectionHeader } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "./motion";

export function AboutSection({ about }: { about: AboutContent }) {
  return (
    <section id="about" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow={about.eyebrow}
            title={about.heading}
            description={about.lead}
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {about.image && (
            <Reveal delay={0.1}>
              <div className="group relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 rounded-[2rem] bg-primary-glow/10 blur-2xl"
                />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
                  <Image
                    src={about.image}
                    alt=""
                    width={520}
                    height={620}
                    sizes="(max-width: 1024px) 90vw, 380px"
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          )}

          <div>
            <RevealGroup className="space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <RevealItem key={i}>
                  <p className="text-lg leading-relaxed text-muted-foreground">{paragraph}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            {about.highlights.length > 0 && (
              <Reveal delay={0.15}>
                <ul className="mt-9 flex flex-wrap gap-2.5">
                  {about.highlights.map((item) => (
                    <li key={item}>
                      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-card">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {about.ctaLabel && about.ctaHref && (
              <Reveal delay={0.2}>
                <a href={about.ctaHref} className={buttonClass("dark", "md", "mt-9")}>
                  {about.ctaLabel}
                  <ArrowRight size={16} aria-hidden />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
