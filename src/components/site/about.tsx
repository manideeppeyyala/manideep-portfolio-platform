/**
 * About + stats.
 *
 * Server component: no interactivity beyond the shared reveal wrapper.
 * Stats are data-driven — never hard-coded numbers in markup.
 */

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import type { About as AboutContent } from "@/lib/schema";
import { live } from "@/lib/schema";
import { buttonClass, SectionHeader, TagPill } from "@/components/ui";
import { Reveal, RevealGroup, RevealItem } from "./motion";

export function AboutSection({ about }: { about: AboutContent }) {
  const stats = live(about.stats);

  return (
    <section id="about" className="section-y bg-background">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow={about.eyebrow}
            title={about.heading}
            description={about.lead}
          />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Portrait + highlights */}
          {about.image && (
            <Reveal delay={0.1}>
              <div className="group relative">
                <div
                  aria-hidden
                  className="absolute -inset-4 rounded-[2rem] bg-primary-glow/10 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                />
                <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
                  <Image
                    src={about.image}
                    alt=""
                    width={520}
                    height={620}
                    sizes="(max-width: 1024px) 90vw, 400px"
                    className="h-auto w-full object-cover"
                  />
                </div>

                {about.highlights.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {about.highlights.map((item) => (
                      <li key={item}>
                        <TagPill tone="muted">{item}</TagPill>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          )}

          {/* Narrative */}
          <div>
            <RevealGroup className="space-y-5">
              {about.paragraphs.map((paragraph, i) => (
                <RevealItem key={i}>
                  <p className="text-lg leading-relaxed text-muted-foreground">{paragraph}</p>
                </RevealItem>
              ))}
            </RevealGroup>

            {stats.length > 0 && (
              <RevealGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <RevealItem key={stat.id}>
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-lift">
                      <p className="text-3xl font-black tracking-tight text-primary">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}

            {about.ctaLabel && about.ctaHref && (
              <Reveal delay={0.15}>
                <a href={about.ctaHref} className={buttonClass("dark", "md", "mt-9")}>
                  <Sparkles size={16} aria-hidden />
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
