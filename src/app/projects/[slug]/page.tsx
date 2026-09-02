/**
 * Project case study.
 *
 * A real route per project rather than a modal, so each case study is
 * linkable, shareable, indexable and has its own OpenGraph metadata.
 * Statically generated for every published project, revalidated hourly.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,

  Target,
  Trophy,
  UserRound,
  Workflow,
} from "lucide-react";
import { getContent } from "@/lib/store";
import { livePublished } from "@/lib/schema";
import { buttonClass, TagPill } from "@/components/ui";
import { Reveal } from "@/components/site/motion";
import { SocialIcon } from "@/components/site/social-icon";
import { SiteFooter } from "@/components/site/footer";
import { live } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { projects } = await getContent();
  return livePublished(projects).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getContent();
  const project = livePublished(projects).find((p) => p.slug === slug);

  if (!project) return { title: "Project not found" };

  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription;
  const image = project.ogImage || project.coverImage;

  return {
    title,
    description,
    alternates: { canonical: siteUrl(`/projects/${project.slug}`) },
    openGraph: {
      type: "article",
      title,
      description,
      url: siteUrl(`/projects/${project.slug}`),
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const content = await getContent();
  const published = livePublished(content.projects);
  const project = published.find((p) => p.slug === slug);

  if (!project) notFound();

  const related = published
    .filter((p) => p.id !== project.id && p.category === project.category)
    .slice(0, 3);

  const meta = [
    project.year && { icon: Calendar, label: "Year", value: project.year },
    project.role && { icon: UserRound, label: "Role", value: project.role },
    project.client && { icon: Workflow, label: "Context", value: project.client },
    project.category && { icon: Target, label: "Category", value: project.category },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; value: string }[];

  const narrative = [
    project.challenge && { icon: Target, title: "The challenge", body: project.challenge },
    project.solution && { icon: Workflow, title: "The solution", body: project.solution },
    project.process && { icon: Workflow, title: "Process", body: project.process },
    project.outcome && { icon: Trophy, title: "Outcome", body: project.outcome },
  ].filter(Boolean) as { icon: typeof Target; title: string; body: string }[];

  return (
    <>
      <main id="main">
        {/* ---- Header ---- */}
        <header className="relative overflow-hidden bg-gradient-hero pb-16 pt-28 text-primary-foreground md:pb-20 md:pt-36">
          <div className="container-page">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground/65 transition-colors hover:text-accent"
            >
              <ArrowLeft size={15} aria-hidden />
              All projects
            </Link>

            <Reveal>
              <div className="mt-8 max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  {project.category && <TagPill>{project.category}</TagPill>}
                  {project.tags.map((tag) => (
                    <TagPill key={tag}>{tag}</TagPill>
                  ))}
                </div>

                <h1 className="mt-5 text-[clamp(2.25rem,5.5vw,4rem)] font-black leading-[1.05] tracking-[-0.03em]">
                  {project.title}
                </h1>

                {project.shortDescription && (
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/70">
                    {project.shortDescription}
                  </p>
                )}

                {(project.liveUrl || project.githubUrl || project.caseStudyUrl) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary")}>
                        View live
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass("outline", "md", "border-white/25 text-primary-foreground hover:bg-white/10")}
                      >
                        <SocialIcon name="github" size={16} />
                        Source
                      </a>
                    )}
                    {project.caseStudyUrl && (
                      <a
                        href={project.caseStudyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonClass("outline", "md", "border-white/25 text-primary-foreground hover:bg-white/10")}
                      >
                        Full write-up
                        <ArrowUpRight size={16} aria-hidden />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </header>

        {/* ---- Cover ---- */}
        {project.coverImage && (
          <div className="container-page -mt-10 md:-mt-14">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
                <Image
                  src={project.coverImage}
                  alt={`${project.title} cover`}
                  width={1600}
                  height={900}
                  priority
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="h-auto w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        )}

        {/* ---- Body ---- */}
        <section className="section-y bg-background">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_18rem] lg:gap-16">
            <div>
              {project.fullDescription && (
                <Reveal>
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {project.fullDescription}
                  </p>
                </Reveal>
              )}

              {narrative.length > 0 && (
                <div className="mt-12 space-y-10">
                  {narrative.map((block) => (
                    <Reveal key={block.title}>
                      <div>
                        <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-foreground">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-accent">
                            <block.icon size={16} aria-hidden />
                          </span>
                          {block.title}
                        </h2>
                        <p className="mt-4 leading-relaxed text-muted-foreground">{block.body}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}

              {/* Gallery */}
              {project.gallery.length > 0 && (
                <Reveal>
                  <div className="mt-14 grid gap-5 sm:grid-cols-2">
                    {project.gallery.map((img) => (
                      <figure key={img.id} className="overflow-hidden rounded-2xl border border-border shadow-card">
                        <Image
                          src={img.url}
                          alt={img.alt}
                          width={800}
                          height={600}
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="h-auto w-full object-cover"
                        />
                        {img.caption && (
                          <figcaption className="bg-card px-4 py-3 text-xs text-muted-foreground">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* ---- Sidebar ---- */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                {meta.length > 0 && (
                  <dl className="space-y-4">
                    {meta.map((item) => (
                      <div key={item.label}>
                        <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          <item.icon size={13} aria-hidden />
                          {item.label}
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-foreground">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {project.technologies.length > 0 && (
                  <div className="mt-6 border-t border-border pt-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Built with
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <li key={tech}>
                          <TagPill tone="muted">{tech}</TagPill>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* ---- Related ---- */}
        {related.length > 0 && (
          <section className="section-y bg-muted/40">
            <div className="container-page">
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                Related projects
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/projects/${item.slug}`}
                    className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary-glow/40 hover:shadow-lift"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary-glow">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-bold leading-snug text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    {item.shortDescription && (
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {item.shortDescription}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter
        settings={content.settings}
        socials={live(content.socialLinks)}
        navigation={live(content.navigation)}
      />
    </>
  );
}
