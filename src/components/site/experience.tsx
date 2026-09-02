/**
 * Experience timeline + Education.
 *
 * A real <ol> so the sequence is conveyed to assistive tech, not just
 * implied by the rail graphic.
 */

import { Briefcase, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import type { Education, Experience } from "@/lib/schema";
import { live, livePublished } from "@/lib/schema";
import { SectionHeader, TagPill } from "@/components/ui";
import { formatRange } from "@/lib/utils";
import { Reveal } from "./motion";

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  const roles = livePublished(experience);
  if (!roles.length) return null;

  return (
    <section id="experience" className="section-y bg-background">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Experience"
            title="Where I've built things."
            description="Roles, responsibilities and the systems I've shipped."
          />
        </Reveal>

        <ol className="mt-14 space-y-6">
          {roles.map((role, index) => (
            <Reveal key={role.id} delay={index * 0.06}>
              <li className="group relative rounded-3xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-lift sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                  {/* Rail marker */}
                  <div className="flex shrink-0 items-start">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-accent shadow-card">
                      <Briefcase size={20} aria-hidden />
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                          {role.position}
                        </h3>
                        <p className="mt-0.5 font-semibold text-primary">
                          {role.url ? (
                            <a
                              href={role.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 hover:underline"
                            >
                              {role.company}
                              <ExternalLink size={13} aria-hidden />
                            </a>
                          ) : (
                            role.company
                          )}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-sm font-semibold text-muted-foreground">
                          {formatRange(role.startDate, role.endDate, role.current)}
                        </p>
                        {role.location && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground/80">
                            <MapPin size={12} aria-hidden />
                            {role.location}
                            {role.employmentType && ` · ${role.employmentType}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {role.description && (
                      <p className="mt-4 leading-relaxed text-muted-foreground">
                        {role.description}
                      </p>
                    )}

                    {role.responsibilities.length > 0 && (
                      <ul className="mt-5 space-y-2.5">
                        {role.responsibilities.map((item, i) => (
                          <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                            <span
                              aria-hidden
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {role.achievements.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {role.achievements.map((item, i) => (
                          <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-foreground">
                            <span aria-hidden className="text-accent">★</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {role.technologies.length > 0 && (
                      <ul className="mt-6 flex flex-wrap gap-2">
                        {role.technologies.map((tech) => (
                          <li key={tech}>
                            <TagPill tone="muted">{tech}</TagPill>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function EducationSection({ education }: { education: Education[] }) {
  const entries = live(education);
  if (!entries.length) return null;

  return (
    <section id="education" className="section-y bg-muted/40">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Education"
            title="Academic foundation."
            description="Where the fundamentals came from."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {entries.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 0.08}>
              <article className="group h-full rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-lift">
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-accent shadow-card">
                    <GraduationCap size={20} aria-hidden />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground">
                      {entry.degree}
                    </h3>
                    {entry.field && (
                      <p className="mt-0.5 text-sm font-semibold text-primary">{entry.field}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{entry.institution}</p>

                    <p className="mt-1 text-xs text-muted-foreground/80">
                      {formatRange(entry.startDate, entry.endDate, false)}
                      {entry.location && ` · ${entry.location}`}
                    </p>

                    {entry.grade && (
                      <p className="mt-3">
                        <TagPill tone="muted">{entry.grade}</TagPill>
                      </p>
                    )}
                  </div>
                </div>

                {entry.description && (
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </p>
                )}

                {entry.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {entry.achievements.map((item, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
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
