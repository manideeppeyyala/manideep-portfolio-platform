"use client";

/**
 * Projects grid with category + technology filtering and search.
 *
 * Filtering is client-side over the already-rendered published set: a
 * portfolio has tens of projects, so a round-trip per keystroke would be
 * slower and worse. Cards link to real routes (`/projects/[slug]`) rather
 * than opening a modal, so every case study is linkable, shareable and
 * independently indexable by search engines.
 */

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Search, Star } from "lucide-react";
import { SocialIcon } from "./social-icon";
import type { Project } from "@/lib/schema";
import { livePublished } from "@/lib/schema";
import { EmptyState, SectionHeader, TagPill } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion";

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
      const haystack = [p.title, p.shortDescription, p.category, ...p.technologies, ...p.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [published, category, query]);

  if (!published.length) return null;

  return (
    <section id="projects" className="section-y bg-background">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Projects"
            title="Selected work."
            description="Systems I've designed, built and shipped — with the reasoning behind them."
          />
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div role="tablist" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                      isActive
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
                placeholder="Search projects…"
                aria-label="Search projects"
                className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary-glow focus:outline-none"
              />
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        {shown.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No projects match that filter"
            description="Try a different category or clear the search."
          />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((project, i) => (
              <motion.article
                key={project.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: reduced ? 0 : Math.min(i * 0.05, 0.3) }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary-glow/40 hover:shadow-lift"
              >
                {/* Cover */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-hero">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <span className="px-6 text-center text-2xl font-black leading-tight tracking-tight text-primary-foreground/25">
                        {project.title}
                      </span>
                    </div>
                  )}

                  {project.featured && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground shadow-gold">
                      <Star size={11} aria-hidden fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-glow">
                    {project.category}
                    {project.year && (
                      <>
                        <span aria-hidden className="text-border">·</span>
                        <span className="text-muted-foreground">{project.year}</span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-2.5 text-lg font-bold leading-snug tracking-tight text-foreground">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="after:absolute after:inset-0 hover:text-primary"
                    >
                      {project.title}
                    </Link>
                  </h3>

                  {project.shortDescription && (
                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {project.shortDescription}
                    </p>
                  )}

                  {project.technologies.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <li key={tech}>
                          <TagPill tone="muted">{tech}</TagPill>
                        </li>
                      ))}
                      {project.technologies.length > 4 && (
                        <li>
                          <TagPill tone="muted">+{project.technologies.length - 4}</TagPill>
                        </li>
                      )}
                    </ul>
                  )}

                  <div className="mt-auto flex items-center gap-4 pt-6">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      View case study
                      <ArrowUpRight
                        size={15}
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>

                    {project.githubUrl && (
                      // z-10 keeps this above the card-wide link overlay.
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                        className="relative z-10 ml-auto text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <SocialIcon name="github" size={17} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
