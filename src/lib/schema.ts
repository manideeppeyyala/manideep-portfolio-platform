/**
 * Content model — the single source of truth for the whole product.
 *
 * Every public section and every admin form derives from these schemas:
 *  - the admin API validates writes against them (server-side, always)
 *  - the public site reads the inferred types
 *  - `defaults.ts` seeds a new install from them
 *
 * Adding a field is a one-line change here; it flows to both sides.
 */

import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

/** Every orderable/toggleable record carries these. */
const record = {
  id: z.string().min(1),
  order: z.number().int().default(0),
  enabled: z.boolean().default(true),
};

export const publishStatus = z.enum(["draft", "published", "archived"]);
export type PublishStatus = z.infer<typeof publishStatus>;

/**
 * Accepts a real URL, a site-relative path, an in-page anchor, a
 * mailto:/tel: link, or empty (= "not set").
 *
 * Anchors matter: this is a single-page portfolio, so most CTAs point at
 * `#projects`-style targets rather than routes.
 */
const linkish = z
  .string()
  .trim()
  .refine(
    (v) =>
      v === "" ||
      v.startsWith("/") ||
      v.startsWith("#") ||
      /^https?:\/\//i.test(v) ||
      v.startsWith("mailto:") ||
      v.startsWith("tel:"),
    { message: "Must be a URL, a /path, a #anchor, mailto:/tel:, or empty" }
  );

const isoDateish = z.string().trim(); // "2024-06", "2024-06-01", "Present", ""

/* ------------------------------------------------------------------ */
/* Site settings                                                       */
/* ------------------------------------------------------------------ */

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(1).max(120),
  siteDescription: z.string().max(400).default(""),
  shortName: z.string().max(40).default(""),
  logoText: z.string().max(8).default("PM"),
  logoImage: linkish.default(""),
  favicon: linkish.default(""),
  profileImage: linkish.default(""),
  email: z.string().max(160).default(""),
  phone: z.string().max(60).default(""),
  whatsapp: z.string().max(60).default(""),
  location: z.string().max(160).default(""),
  availabilityStatus: z.string().max(120).default(""),
  availabilityOpen: z.boolean().default(true),
  responseTime: z.string().max(160).default(""),
  footerText: z.string().max(400).default(""),
  copyrightText: z.string().max(200).default(""),
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().max(400).default(""),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const navItemSchema = z.object({
  ...record,
  label: z.string().min(1).max(40),
  href: z.string().min(1).max(160),
  external: z.boolean().default(false),
});
export type NavItem = z.infer<typeof navItemSchema>;

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const heroSchema = z.object({
  eyebrow: z.string().max(120).default(""),
  name: z.string().min(1).max(120),
  /** Rendered in the accent gradient — usually the surname. */
  nameAccent: z.string().max(120).default(""),
  titles: z.array(z.string().max(80)).default([]),
  intro: z.string().max(800).default(""),
  primaryCtaLabel: z.string().max(40).default(""),
  primaryCtaHref: linkish.default(""),
  secondaryCtaLabel: z.string().max(40).default(""),
  secondaryCtaHref: linkish.default(""),
  tertiaryCtaLabel: z.string().max(40).default(""),
  tertiaryCtaHref: linkish.default(""),
  image: linkish.default(""),
  imageAlt: z.string().max(200).default(""),
  showSocials: z.boolean().default(true),
  showParticles: z.boolean().default(true),
});
export type Hero = z.infer<typeof heroSchema>;

/* ------------------------------------------------------------------ */
/* Stats + About                                                       */
/* ------------------------------------------------------------------ */

export const statSchema = z.object({
  ...record,
  value: z.string().max(20),
  label: z.string().max(60),
});
export type Stat = z.infer<typeof statSchema>;

export const aboutSchema = z.object({
  eyebrow: z.string().max(60).default("About"),
  heading: z.string().max(200).default(""),
  lead: z.string().max(600).default(""),
  paragraphs: z.array(z.string().max(1500)).default([]),
  image: linkish.default(""),
  highlights: z.array(z.string().max(80)).default([]),
  ctaLabel: z.string().max(40).default(""),
  ctaHref: linkish.default(""),
  stats: z.array(statSchema).default([]),
});
export type About = z.infer<typeof aboutSchema>;

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skillSchema = z.object({
  ...record,
  name: z.string().min(1).max(60),
  category: z.string().max(60).default("General"),
  /** 0–100; drives the proficiency meter. */
  level: z.number().int().min(0).max(100).default(0),
  years: z.number().min(0).max(60).default(0),
  icon: z.string().max(40).default(""),
  description: z.string().max(300).default(""),
  featured: z.boolean().default(false),
});
export type Skill = z.infer<typeof skillSchema>;

export const skillCategorySchema = z.object({
  ...record,
  name: z.string().min(1).max(60),
  icon: z.string().max(40).default(""),
  description: z.string().max(300).default(""),
});
export type SkillCategory = z.infer<typeof skillCategorySchema>;

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export const experienceSchema = z.object({
  ...record,
  company: z.string().min(1).max(120),
  position: z.string().min(1).max(120),
  employmentType: z.string().max(60).default(""),
  location: z.string().max(120).default(""),
  startDate: isoDateish.default(""),
  endDate: isoDateish.default(""),
  current: z.boolean().default(false),
  description: z.string().max(1500).default(""),
  responsibilities: z.array(z.string().max(400)).default([]),
  achievements: z.array(z.string().max(400)).default([]),
  technologies: z.array(z.string().max(60)).default([]),
  logo: linkish.default(""),
  url: linkish.default(""),
  status: publishStatus.default("published"),
});
export type Experience = z.infer<typeof experienceSchema>;

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export const educationSchema = z.object({
  ...record,
  institution: z.string().min(1).max(160),
  degree: z.string().max(160).default(""),
  field: z.string().max(160).default(""),
  startDate: isoDateish.default(""),
  endDate: isoDateish.default(""),
  grade: z.string().max(60).default(""),
  location: z.string().max(120).default(""),
  description: z.string().max(1000).default(""),
  achievements: z.array(z.string().max(300)).default([]),
  logo: linkish.default(""),
});
export type Education = z.infer<typeof educationSchema>;

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export const certificationSchema = z.object({
  ...record,
  title: z.string().min(1).max(200),
  issuer: z.string().max(120).default(""),
  issueDate: isoDateish.default(""),
  expiryDate: isoDateish.default(""),
  credentialId: z.string().max(120).default(""),
  credentialUrl: linkish.default(""),
  image: linkish.default(""),
  category: z.string().max(60).default(""),
  description: z.string().max(600).default(""),
  featured: z.boolean().default(false),
});
export type Certification = z.infer<typeof certificationSchema>;

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const serviceSchema = z.object({
  ...record,
  title: z.string().min(1).max(120),
  description: z.string().max(800).default(""),
  icon: z.string().max(40).default(""),
  features: z.array(z.string().max(160)).default([]),
  status: publishStatus.default("published"),
});
export type Service = z.infer<typeof serviceSchema>;

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export const projectImageSchema = z.object({
  id: z.string().min(1),
  url: linkish,
  alt: z.string().max(200).default(""),
  caption: z.string().max(300).default(""),
});
export type ProjectImage = z.infer<typeof projectImageSchema>;

export const projectSchema = z.object({
  ...record,
  title: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only"),
  shortDescription: z.string().max(400).default(""),
  fullDescription: z.string().max(6000).default(""),
  category: z.string().max(60).default(""),
  tags: z.array(z.string().max(40)).default([]),
  technologies: z.array(z.string().max(40)).default([]),
  coverImage: linkish.default(""),
  gallery: z.array(projectImageSchema).default([]),
  videoUrl: linkish.default(""),
  githubUrl: linkish.default(""),
  liveUrl: linkish.default(""),
  caseStudyUrl: linkish.default(""),
  year: z.string().max(20).default(""),
  client: z.string().max(120).default(""),
  role: z.string().max(120).default(""),
  /** Case-study narrative blocks — all optional. */
  challenge: z.string().max(3000).default(""),
  solution: z.string().max(3000).default(""),
  process: z.string().max(3000).default(""),
  outcome: z.string().max(3000).default(""),
  featured: z.boolean().default(false),
  status: publishStatus.default("published"),
  seoTitle: z.string().max(160).default(""),
  seoDescription: z.string().max(320).default(""),
  ogImage: linkish.default(""),
});
export type Project = z.infer<typeof projectSchema>;

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const testimonialSchema = z.object({
  ...record,
  name: z.string().min(1).max(120),
  role: z.string().max(120).default(""),
  company: z.string().max(120).default(""),
  avatar: linkish.default(""),
  quote: z.string().max(1200).default(""),
  rating: z.number().int().min(1).max(5).default(5),
  status: publishStatus.default("published"),
});
export type Testimonial = z.infer<typeof testimonialSchema>;

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export const galleryItemSchema = z.object({
  ...record,
  title: z.string().max(160).default(""),
  caption: z.string().max(400).default(""),
  /** Image URL, or a poster frame when `video` is set. */
  image: linkish.default(""),
  /** Optional video (mp4/webm or an embed URL). Falls back to the image. */
  video: linkish.default(""),
  category: z.string().max(60).default(""),
  date: isoDateish.default(""),
  featured: z.boolean().default(false),
});
export type GalleryItem = z.infer<typeof galleryItemSchema>;

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

export const socialLinkSchema = z.object({
  ...record,
  platform: z.string().min(1).max(40),
  label: z.string().max(60).default(""),
  url: linkish,
  icon: z.string().max(40).default(""),
  handle: z.string().max(80).default(""),
  featured: z.boolean().default(false),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;

/* ------------------------------------------------------------------ */
/* Resume                                                              */
/* ------------------------------------------------------------------ */

export const resumeSchema = z.object({
  enabled: z.boolean().default(true),
  buttonLabel: z.string().max(40).default("Download Resume"),
  fileUrl: linkish.default(""),
  fileName: z.string().max(160).default(""),
  updatedAt: z.string().default(""),
  note: z.string().max(300).default(""),
});
export type Resume = z.infer<typeof resumeSchema>;

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contactSchema = z.object({
  eyebrow: z.string().max(60).default("Contact"),
  heading: z.string().max(200).default(""),
  description: z.string().max(800).default(""),
  formEnabled: z.boolean().default(true),
  successMessage: z.string().max(400).default(""),
});
export type Contact = z.infer<typeof contactSchema>;

export const messageStatus = z.enum(["new", "read", "replied", "archived"]);
export type MessageStatus = z.infer<typeof messageStatus>;

export const contactMessageSchema = z.object({
  id: z.string(),
  name: z.string().max(120),
  email: z.string().max(200),
  subject: z.string().max(200).default(""),
  message: z.string().max(5000),
  status: messageStatus.default("new"),
  createdAt: z.string(),
  readAt: z.string().default(""),
});
export type ContactMessage = z.infer<typeof contactMessageSchema>;

/** What the public form is allowed to submit (never trusts the client). */
export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  /**
   * Honeypot. Deliberately permissive here: the route checks it *after*
   * parsing and returns a normal success response, so a bot is never told
   * it was detected. Rejecting it at the schema level would leak that.
   */
  website: z.string().max(200).optional().default(""),
});
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/* ------------------------------------------------------------------ */
/* SEO                                                                 */
/* ------------------------------------------------------------------ */

export const seoSchema = z.object({
  defaultTitle: z.string().max(160).default(""),
  titleTemplate: z.string().max(80).default("%s · Portfolio"),
  defaultDescription: z.string().max(320).default(""),
  keywords: z.array(z.string().max(60)).default([]),
  ogImage: linkish.default(""),
  twitterHandle: z.string().max(60).default(""),
  canonicalUrl: linkish.default(""),
  robotsIndex: z.boolean().default(true),
  structuredDataEnabled: z.boolean().default(true),
  analyticsId: z.string().max(80).default(""),
  analyticsProvider: z.enum(["none", "plausible", "umami", "ga4"]).default("none"),
  analyticsDomain: z.string().max(160).default(""),
});
export type Seo = z.infer<typeof seoSchema>;

/* ------------------------------------------------------------------ */
/* Theme / appearance                                                  */
/* ------------------------------------------------------------------ */

/**
 * Constrained on purpose. The admin picks from curated, contrast-checked
 * token sets rather than arbitrary colours, so no setting can break the
 * design system or accessibility.
 */
export const themeSchema = z.object({
  accent: z.enum(["gold", "amber", "cyan", "violet", "emerald", "rose"]).default("gold"),
  surface: z.enum(["navy", "slate", "charcoal"]).default("navy"),
  radius: z.enum(["sharp", "soft", "round"]).default("soft"),
  density: z.enum(["comfortable", "compact"]).default("comfortable"),
  motion: z.enum(["full", "subtle", "off"]).default("full"),
  heroStyle: z.enum(["particles", "gradient", "plain"]).default("particles"),
  fontScale: z.enum(["sm", "md", "lg"]).default("md"),
});
export type Theme = z.infer<typeof themeSchema>;

/* ------------------------------------------------------------------ */
/* Section visibility + ordering                                       */
/* ------------------------------------------------------------------ */

export const SECTION_KEYS = [
  "hero",
  "about",
  "skills",
  "experience",
  "projects",
  "services",
  "certifications",
  "education",
  "testimonials",
  "gallery",
  "contact",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export const sectionConfigSchema = z.object({
  key: z.enum(SECTION_KEYS),
  label: z.string().max(60),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
});
export type SectionConfig = z.infer<typeof sectionConfigSchema>;

/* ------------------------------------------------------------------ */
/* Activity log                                                        */
/* ------------------------------------------------------------------ */

export const activityLogSchema = z.object({
  id: z.string(),
  action: z.string().max(200),
  module: z.string().max(60),
  at: z.string(),
});
export type ActivityLog = z.infer<typeof activityLogSchema>;

/* ------------------------------------------------------------------ */
/* The whole content document                                          */
/* ------------------------------------------------------------------ */

export const contentSchema = z.object({
  settings: siteSettingsSchema,
  navigation: z.array(navItemSchema),
  sections: z.array(sectionConfigSchema),
  hero: heroSchema,
  about: aboutSchema,
  skillCategories: z.array(skillCategorySchema),
  skills: z.array(skillSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  services: z.array(serviceSchema),
  projects: z.array(projectSchema),
  testimonials: z.array(testimonialSchema),
  socialLinks: z.array(socialLinkSchema),
  gallery: z.array(galleryItemSchema),
  resume: resumeSchema,
  contact: contactSchema,
  seo: seoSchema,
  theme: themeSchema,
});
export type Content = z.infer<typeof contentSchema>;

/** Admin writes target exactly one top-level key at a time. */
export const CONTENT_KEYS = Object.keys(contentSchema.shape) as (keyof Content)[];

/** Per-key validator used by the admin API before any write. */
export function validateContentKey<K extends keyof Content>(
  key: K,
  value: unknown
): { ok: true; data: Content[K] } | { ok: false; error: string } {
  const shape = contentSchema.shape[key] as z.ZodType;
  const parsed = shape.safeParse(value);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first ? `${first.path.join(".") || key}: ${first.message}` : "Invalid data",
    };
  }
  return { ok: true, data: parsed.data as Content[K] };
}

/* ------------------------------------------------------------------ */
/* Helpers shared by public + admin                                    */
/* ------------------------------------------------------------------ */

/** Visible, correctly ordered records. */
export function live<T extends { enabled: boolean; order: number }>(items: T[]): T[] {
  return [...(items ?? [])].filter((i) => i.enabled).sort((a, b) => a.order - b.order);
}

/** Visible + published, correctly ordered. */
export function livePublished<T extends { enabled: boolean; order: number; status: PublishStatus }>(
  items: T[]
): T[] {
  return [...(items ?? [])]
    .filter((i) => i.enabled && i.status === "published")
    .sort((a, b) => a.order - b.order);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
