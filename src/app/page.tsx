/**
 * Public portfolio.
 *
 * Sections render in the order the admin configured and only when enabled —
 * the page composes itself from `content.sections` rather than a fixed JSX
 * sequence, so reordering in the admin genuinely reorders the site.
 */

import type { ReactNode } from "react";
import { getContent } from "@/lib/store";
import { live, type SectionKey } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";
import { SiteNav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { AboutSection } from "@/components/site/about";
import { SkillsSection } from "@/components/site/skills";
import { ExperienceSection, EducationSection } from "@/components/site/experience";
import { ProjectsSection } from "@/components/site/projects";
import {
  CertificationsSection,
  ServicesSection,
  TestimonialsSection,
} from "@/components/site/credentials";
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

  /* Each section key maps to its rendered output; order comes from CMS. */
  const registry: Record<SectionKey, ReactNode> = {
    hero: (
      <Hero hero={hero} socials={featuredSocials} resume={content.resume} />
    ),
    about: <AboutSection about={about} />,
    skills: (
      <SkillsSection skills={content.skills} categories={content.skillCategories} />
    ),
    experience: <ExperienceSection experience={content.experience} />,
    projects: <ProjectsSection projects={content.projects} />,
    services: <ServicesSection services={content.services} />,
    certifications: <CertificationsSection certifications={content.certifications} />,
    education: <EducationSection education={content.education} />,
    testimonials: <TestimonialsSection testimonials={content.testimonials} />,
    contact: (
      <ContactSection contact={content.contact} settings={settings} socials={socials} />
    ),
  };

  const ordered = [...content.sections]
    .filter((s) => s.enabled)
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
        sameAs: socials
          .map((s) => s.url)
          .filter((url) => url.startsWith("http")),
        knowsAbout: content.skills.filter((s) => s.featured).map((s) => s.name),
      }
    : null;

  return (
    <>
      {personSchema && (
        <script
          type="application/ld+json"
          // Content is our own CMS data, serialized — not user input.
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
