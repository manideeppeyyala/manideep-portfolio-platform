"use client";

/**
 * Skills — light band, compact four-column grid.
 *
 * Follows the reference's dense card grid: each skill gets a monogram
 * tile, a level badge and a proficiency meter. Category chips filter the
 * grid client-side (tens of items — a round trip would be worse).
 *
 * The proficiency number is also written as text and exposed via
 * aria-label, so the meter is never colour- or width-only information.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Skill, SkillCategory } from "@/lib/schema";
import { live } from "@/lib/schema";
import { SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

const ALL = "All";

/** Two-letter monogram, e.g. "Power BI" → "PB", "Python" → "PY". */
function monogram(name: string): string {
  const words = name.replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function levelLabel(level: number): string {
  if (level >= 85) return "Expert";
  if (level >= 70) return "Advanced";
  if (level >= 50) return "Working";
  return "Learning";
}

export function SkillsSection({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: SkillCategory[];
}) {
  const visibleSkills = useMemo(() => live(skills), [skills]);
  const visibleCategories = useMemo(() => live(categories), [categories]);
  const reduced = useReducedMotion();

  const [filter, setFilter] = useState<string>(ALL);

  const chips = useMemo(() => {
    const used = new Set(visibleSkills.map((s) => s.category));
    const ordered = visibleCategories.filter((c) => used.has(c.name)).map((c) => c.name);
    const extras = [...used].filter((name) => !ordered.includes(name));
    return [ALL, ...ordered, ...extras];
  }, [visibleSkills, visibleCategories]);

  const shown = useMemo(
    () => (filter === ALL ? visibleSkills : visibleSkills.filter((s) => s.category === filter)),
    [filter, visibleSkills]
  );

  if (!visibleSkills.length) return null;

  return (
    <section id="skills" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Skills"
            title="The toolkit."
            description="Languages, data tooling and enterprise platforms I use day to day, grouped by where they fit in the stack."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="mt-10 flex flex-wrap gap-2"
          >
            {chips.map((chip) => {
              const active = filter === chip;
              return (
                <button
                  key={chip}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(chip)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                    active
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "border border-border bg-card text-muted-foreground hover:text-foreground"
                  )}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((skill, i) => (
            <motion.article
              key={skill.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : Math.min(i * 0.03, 0.3) }}
              className="group rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-gold"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-sm font-bold text-primary-foreground shadow-glow">
                  {monogram(skill.name)}
                </span>
                {skill.level > 0 && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                    {levelLabel(skill.level)}
                  </span>
                )}
              </div>

              <h3 className="mt-4 font-bold leading-snug text-foreground">{skill.name}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {skill.category}
                {skill.years > 0 && ` · ${skill.years}y`}
              </p>

              {skill.level > 0 && (
                <>
                  <div
                    className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`${skill.name}: ${skill.level} percent proficiency`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-gold"
                      initial={reduced ? false : { width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                      style={reduced ? { width: `${skill.level}%` } : undefined}
                    />
                  </div>
                  <p className="mt-1.5 text-right text-[11px] font-semibold tabular-nums text-muted-foreground">
                    {skill.level}%
                  </p>
                </>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
