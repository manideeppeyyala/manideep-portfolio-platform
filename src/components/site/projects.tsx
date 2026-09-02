"use client";

/**
 * Work & Research — light band, filterable vertical timeline.
 *
 * Follows the reference's publications flow rather than a card grid: a
 * filter chip row, a live search, then a rail of entries each marked with
 * a dot, a year badge, a category badge and accent tags.
 *
 * Filtering is client-side over the already-rendered published set — a
 * portfolio has tens of entries, so a round-trip per keystroke would be
 * slower and worse. Each entry still links to its own real case-study
 * route, so every project stays linkable and indexable.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Search } from "lucide-react";
import type { Project } from "@/lib/schema";
import { livePublished } from "@/lib/schema";
import { EmptyState, SectionHeader } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";
import { SocialIcon } from "./social-icon";

const ALL = "All";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const published = useMemo(() => livePublished(projects), [projects]);
  const reduced = useReducedMotion();

  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set(published.map((p) => p.category).filter(Boolean));
    return [ALL, ...set];
  }, [published]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return published.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (!q) return true;
      return [p.title, p.shortDescription, p.category, ...p.technologies, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [published, category, query]);

  if (!published.length) return null;

  return (
    <section id="projects" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Work & Research"
            title="Selected work."
            description="A searchable, filterable timeline of the systems I've built and the research I've published."
          />
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="tablist" aria-label="Filter work by category" className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                      active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "border border-border bg-card text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="relative sm:w-64">
              <Search
                size={16}
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search work…"
                aria-label="Search work"
                className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary-glow focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        {shown.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Nothing matches that filter"
            description="Try a different category or clear the search."
          />
        ) : (
          <ol className="relative mt-12 space-y-5 md:border-l md:border-border md:pl-0">
            {shown.map((project, i) => (
              <motion.li
                key={project.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduced ? 0 : Math.min(i * 0.05, 0.3) }}
                className="relative md:pl-12"
              >
                {/* Rail marker */}
                <span
                  aria-hidden
                  className="absolute left-0 top-7 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent/20 md:block"
                />

                <div className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-lift">
                  {/* Badge row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {project.year && (
                      <span className="rounded-full bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground">
                        {project.year}
                      </span>
                    )}
                    {project.category && (
                      <span className="rounded-full border border-border px-2.5 py-0.5 text-muted-foreground">
                        {project.category}
                      </span>
                    )}
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3.5 text-lg font-bold leading-snug tracking-tight text-foreground">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="after:absolute after:inset-0 hover:text-primary"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {project.shortDescription && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.shortDescription}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    {project.role && (
                      <span className="text-xs text-muted-foreground/80">{project.role}</span>
                    )}

                    <span className="ml-auto inline-flex items-center gap-1.5 font-semibold text-primary">
                      View case study
                      <ArrowUpRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>

                    {/* z-10 keeps these above the card-wide link overlay */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="relative z-10 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <SocialIcon name="github" size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} live site`}
                        className="relative z-10 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ExternalLink size={15} aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
