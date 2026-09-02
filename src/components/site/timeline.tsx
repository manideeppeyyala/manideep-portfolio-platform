/**
 * Career timeline — light band, alternating centre rail.
 *
 * Experience and education are merged into one chronological rail, which
 * reads as a single career story rather than two disconnected lists.
 * Entries alternate sides on desktop and collapse to a single left-aligned
 * column on mobile.
 *
 * A real <ol> so the sequence is conveyed to assistive tech, not just
 * implied by the graphic.
 */

import { Briefcase, GraduationCap } from "lucide-react";
import type { Education, Experience } from "@/lib/schema";
import { live, livePublished } from "@/lib/schema";
import { SectionHeader, TagPill } from "@/components/ui";
import { formatRange } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

type Entry = {
  id: string;
  kind: "work" | "study";
  title: string;
  org: string;
  location: string;
  range: string;
  description: string;
  bullets: string[];
  tags: string[];
  sortKey: string;
};

export function TimelineSection({
  experience,
  education,
}: {
  experience: Experience[];
  education: Education[];
}) {
  const work: Entry[] = livePublished(experience).map((role) => ({
    id: role.id,
    kind: "work",
    title: role.position,
    org: role.company,
    location: role.location,
    range: formatRange(role.startDate, role.endDate, role.current),
    description: role.description,
    bullets: role.responsibilities.slice(0, 4),
    tags: role.technologies,
    // `current` roles sort to the top; otherwise newest start date first.
    sortKey: role.current ? "9999" : role.startDate || "0000",
  }));

  const study: Entry[] = live(education).map((entry) => ({
    id: entry.id,
    kind: "study",
    title: entry.degree,
    org: entry.institution,
    location: entry.location,
    range: formatRange(entry.startDate, entry.endDate, false),
    description: entry.description,
    bullets: entry.achievements.slice(0, 3),
    tags: entry.grade ? [entry.grade] : [],
    sortKey: entry.endDate || entry.startDate || "0000",
  }));

  const entries = [...work, ...study].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  if (!entries.length) return null;

  return (
    <section id="experience" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page relative">
        <Reveal>
          <SectionHeader
            eyebrow="Experience & Education"
            title="A timeline of the work."
            description="Where I've built systems, and where the fundamentals came from."
          />
        </Reveal>

        <ol className="relative mt-16 space-y-10 md:space-y-0">
          {/* Centre rail (desktop only) */}
          <span
            aria-hidden
            className="absolute left-2.5 top-0 hidden h-full w-px bg-border md:left-1/2 md:block"
          />

          {entries.map((entry, index) => {
            const rightSide = index % 2 === 1;
            const Icon = entry.kind === "work" ? Briefcase : GraduationCap;

            return (
              <Reveal key={entry.id} delay={Math.min(index * 0.06, 0.3)}>
                <li className="relative md:grid md:grid-cols-2 md:gap-12 md:pb-14">
                  {/* Rail dot */}
                  <span
                    aria-hidden
                    className="absolute left-2.5 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent/25 md:left-1/2"
                  />

                  {/* Spacer so odd entries sit on the right */}
                  {rightSide && <div className="hidden md:block" />}

                  <div
                    className={cn(
                      "pl-10 md:pl-0",
                      rightSide ? "md:pl-12" : "md:pr-12 md:text-right"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2.5",
                        !rightSide && "md:justify-end"
                      )}
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-gold text-accent-foreground">
                        <Icon size={15} aria-hidden />
                      </span>
                      <span className="rounded-full bg-gradient-gold px-3 py-1 text-xs font-bold text-accent-foreground">
                        {entry.range}
                      </span>
                    </div>

                    <h3 className="mt-3.5 text-lg font-bold text-foreground">
                      {entry.title}
                    </h3>
                    <p className="text-sm font-semibold text-primary">{entry.org}</p>
                    {entry.location && (
                      <p className="mt-0.5 text-xs text-muted-foreground/80">{entry.location}</p>
                    )}

                    {entry.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {entry.description}
                      </p>
                    )}

                    {entry.bullets.length > 0 && (
                      <ul className="mt-3.5 space-y-2">
                        {entry.bullets.map((bullet, i) => (
                          <li
                            key={i}
                            className={cn(
                              "flex gap-2.5 text-sm leading-relaxed text-muted-foreground",
                              !rightSide && "md:flex-row-reverse md:text-right"
                            )}
                          >
                            <span
                              aria-hidden
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}

                    {entry.tags.length > 0 && (
                      <ul
                        className={cn(
                          "mt-4 flex flex-wrap gap-1.5",
                          !rightSide && "md:justify-end"
                        )}
                      >
                        {entry.tags.map((tag) => (
                          <li key={tag}>
                            <TagPill tone="muted">{tag}</TagPill>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
