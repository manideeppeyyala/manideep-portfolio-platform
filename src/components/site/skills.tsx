"use client";

/**
 * Skills.
 *
 * Navy section: category filter chips + proficiency cards. The filter is
 * client-side over already-loaded data — there are tens of skills, so
 * paginating or refetching would be worse UX for no benefit.
 *
 * The proficiency meter is presentational; the number is also written out
 * as text so it isn't colour/width-only information.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Skill, SkillCategory } from "@/lib/schema";
import { live } from "@/lib/schema";
import { SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

const ALL = "All";

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
    // Include any category present on a skill but missing from the category list.
    const extras = [...used].filter((name) => !ordered.includes(name));
    return [ALL, ...ordered, ...extras];
  }, [visibleSkills, visibleCategories]);

  const shown = useMemo(
    () => (filter === ALL ? visibleSkills : visibleSkills.filter((s) => s.category === filter)),
    [filter, visibleSkills]
  );

  if (!visibleSkills.length) return null;

  return (
    <section id="skills" className="section-y relative overflow-hidden bg-navy-900 text-primary-foreground">
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
            eyebrow="Skills"
            title="The stack behind the work."
            description="Languages, data tooling and enterprise platforms I use to build and ship backend systems."
          />
        </Reveal>

        {/* Filter chips */}
        <Reveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Filter skills by category"
            className="mt-10 flex flex-wrap gap-2"
          >
            {chips.map((chip) => {
              const isActive = filter === chip;
              return (
                <button
                  key={chip}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(chip)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-gold"
                      : "border border-white/15 text-primary-foreground/65 hover:border-white/30 hover:text-primary-foreground"
                  )}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Skill cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((skill, i) => (
            <motion.article
              key={skill.id}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : Math.min(i * 0.03, 0.3) }}
              className="group rounded-2xl border border-white/10 bg-navy-950/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-gold"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-semibold text-primary-foreground">{skill.name}</h3>
                {skill.level > 0 && (
                  <span className="shrink-0 text-xs font-bold tabular-nums text-accent">
                    {skill.level}%
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary-foreground/40">
                {skill.category}
                {skill.years > 0 && ` · ${skill.years}y`}
              </p>

              {skill.level > 0 && (
                <div
                  className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"
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
              )}

              {skill.description && (
                <p className="mt-3 text-sm leading-relaxed text-primary-foreground/55">
                  {skill.description}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
