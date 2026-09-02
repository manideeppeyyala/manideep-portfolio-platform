/**
 * Public portfolio.
 *
 * Sections render in the order the admin configured and only when enabled —
 * the page composes itself from `content.sections` rather than a fixed JSX
 * sequence, so reordering in the admin genuinely reorders the site.
 *
 * The visual flow deliberately alternates deep → soft → deep bands, which
 * is what gives the page its rhythm; keep that in mind when reordering.
 */

import type { ReactNode } from "react";
import { getContent } from "@/lib/store";
import { live, type SectionKey } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about";
import { ExpertiseSection } from "@/components/site/expertise";
import { SkillsSection } from "@/components/site/skills";
import { TimelineSection } from "@/components/site/timeline";
import { ProjectsSection } from "@/components/site/projects";
import { CertificationsSection, TestimonialsSection } from "@/components/site/credentials";
import { GallerySection } from "@/components/site/gallery";
import { ContactSection } from "@/components/site/contact";
import { SiteFooter } from "@/components/site/footer";
import { MaintenanceScreen } from "@/components/site/maintenance";

/** Re-read content at most every 60s in production. */
export const revalidate = 60;

export default async function HomePage() {
  const content = await getContent();
  const { settings, hero, about, seo } = content;

  if (settings.maintenanceMode) {
    return <MaintenanceScreen settings={settings} />;
  }

  const socials = live(content.socialLinks);
  const featuredSocials = socials.filter((s) => s.featured);

  /*
   * Each section key maps to its rendered output; order comes from the CMS.
   *
   * `experience` renders the merged experience + education timeline, and
   * `education` is intentionally absent from the registry — merging them
   * into one chronological rail reads as a single career story. The
   * `education` key stays in the schema so its content remains editable.
   */
  const registry: Partial<Record<SectionKey, ReactNode>> = {
    hero: (
      <Hero
        hero={hero}
        socials={featuredSocials}
        resume={content.resume}
        stats={live(about.stats)}
      />
    ),
    about: <AboutSection about={about} />,
    services: <ExpertiseSection services={content.services} />,
    projects: <ProjectsSection projects={content.projects} />,
    certifications: <CertificationsSection certifications={content.certifications} />,
    skills: (
      <SkillsSection skills={content.skills} categories={content.skillCategories} />
    ),
    experience: (
      <TimelineSection experience={content.experience} education={content.education} />
    ),
    gallery: <GallerySection items={content.gallery} />,
    testimonials: <TestimonialsSection testimonials={content.testimonials} />,
    contact: (
      <ContactSection contact={content.contact} settings={settings} socials={socials} />
    ),
  };

  const ordered = [...content.sections]
    .filter((s) => s.enabled && registry[s.key])
    .sort((a, b) => a.order - b.order);

  /* Person structured data — improves how search engines read the page. */
  const personSchema = seo.structuredDataEnabled
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: settings.shortName,
        url: siteUrl(),
        email: settings.email || undefined,
        telephone: settings.phone || undefined,
        image: settings.profileImage ? siteUrl(settings.profileImage) : undefined,
        jobTitle: hero.titles[0] || undefined,
        description: seo.defaultDescription || settings.siteDescription,
        address: settings.location
          ? { "@type": "PostalAddress", addressLocality: settings.location }
          : undefined,
        sameAs: socials.map((s) => s.url).filter((url) => url.startsWith("http")),
        knowsAbout: content.skills.filter((s) => s.featured).map((s) => s.name),
      }
    : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          // Our own CMS data, serialized — not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      )}

      <SiteNav
        items={live(content.navigation)}
        logoText={settings.logoText}
        name={settings.shortName}
        ctaLabel={content.hero.tertiaryCtaLabel || "Contact"}
        ctaHref={content.hero.tertiaryCtaHref || "#contact"}
      />

      <main id="main">
        {ordered.map((section) => (
          <div key={section.key}>{registry[section.key]}</div>
        ))}
      </main>

      <SiteFooter
        settings={settings}
        socials={socials}
        navigation={live(content.navigation)}
      />
    </>
  );
}
