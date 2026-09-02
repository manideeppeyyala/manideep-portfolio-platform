/**
 * Admin module registry.
 *
 * Every CMS screen is generated from these declarations rather than
 * hand-written per entity. Adding a field to a form means adding one line
 * here — the form control, the list preview and the save path all follow.
 *
 * `kind: "object"` → a singleton (Hero, About, Settings…)
 * `kind: "collection"` → an ordered, addable list (Projects, Skills…)
 */

import type { Content } from "./schema";
import { CONTENT_ICON_NAMES } from "@/components/site/content-icon";
import { SOCIAL_ICON_NAMES } from "@/components/site/social-icon";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "range"
  | "boolean"
  | "select"
  | "tags"
  | "paragraphs"
  | "image"
  | "file"
  | "url"
  | "date"
  | "slug"
  | "color";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  options?: string[];
  /** For `range` */
  min?: number;
  max?: number;
  /** Full-width in the two-column form grid. */
  wide?: boolean;
  required?: boolean;
};

export type ModuleConfig = {
  /** The `Content` key this module writes to. */
  key: keyof Content;
  slug: string;
  label: string;
  description: string;
  icon: string;
  kind: "object" | "collection";
  group: "content" | "system";
  /** Collections: which field to show as the row title / subtitle. */
  titleField?: string;
  subtitleField?: string;
  fields: Field[];
  /** Template for a new collection row. */
  blank?: Record<string, unknown>;
};

const PUBLISH_OPTIONS = ["published", "draft", "archived"];

export const MODULES: ModuleConfig[] = [
  /* ---------------------------------------------------------------- */
  {
    key: "hero",
    slug: "hero",
    label: "Hero",
    description: "The first thing visitors see — name, roles, intro and calls to action.",
    icon: "Sparkles",
    kind: "object",
    group: "content",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", wide: true, help: "Small pill above your name." },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "nameAccent", label: "Name (accent)", type: "text", help: "Shown in the gold gradient — usually your surname." },
      { key: "titles", label: "Rotating titles", type: "tags", wide: true, help: "Cycled by the typewriter. One is fine." },
      { key: "intro", label: "Intro paragraph", type: "textarea", wide: true },
      { key: "primaryCtaLabel", label: "Primary button label", type: "text" },
      { key: "primaryCtaHref", label: "Primary button link", type: "url" },
      { key: "secondaryCtaLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "url" },
      { key: "tertiaryCtaLabel", label: "Third button label", type: "text" },
      { key: "tertiaryCtaHref", label: "Third button link", type: "url" },
      { key: "image", label: "Portrait", type: "image", wide: true },
      { key: "imageAlt", label: "Portrait alt text", type: "text", wide: true, help: "Describes the image for screen readers." },
      { key: "showSocials", label: "Show social icons", type: "boolean" },
      { key: "showParticles", label: "Show constellation background", type: "boolean" },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "about",
    slug: "about",
    label: "About",
    description: "Your story, headline stats and highlights.",
    icon: "UserRound",
    kind: "object",
    group: "content",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text", wide: true },
      { key: "lead", label: "Lead sentence", type: "textarea", wide: true },
      { key: "paragraphs", label: "Body paragraphs", type: "paragraphs", wide: true },
      { key: "image", label: "Image", type: "image" },
      { key: "highlights", label: "Highlight tags", type: "tags", wide: true },
      { key: "ctaLabel", label: "Button label", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "skills",
    slug: "skills",
    label: "Skills",
    description: "Technologies and capabilities, grouped by category.",
    icon: "Boxes",
    kind: "collection",
    group: "content",
    titleField: "name",
    subtitleField: "category",
    fields: [
      { key: "name", label: "Skill", type: "text", required: true },
      { key: "category", label: "Category", type: "text", help: "Matches a Skill Category name." },
      { key: "level", label: "Proficiency", type: "range", min: 0, max: 100, help: "0 hides the meter." },
      { key: "years", label: "Years of experience", type: "number" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      name: "",
      category: "General",
      level: 70,
      years: 1,
      icon: "",
      description: "",
      featured: false,
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "skillCategories",
    slug: "skill-categories",
    label: "Skill Categories",
    description: "The filter chips shown above the skills grid.",
    icon: "LayoutDashboard",
    kind: "collection",
    group: "content",
    titleField: "name",
    fields: [
      { key: "name", label: "Category name", type: "text", required: true },
      { key: "icon", label: "Icon", type: "select", options: ["", ...CONTENT_ICON_NAMES] },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: { name: "", icon: "", description: "", enabled: true },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "experience",
    slug: "experience",
    label: "Experience",
    description: "Roles, responsibilities and the technologies used.",
    icon: "Briefcase",
    kind: "collection",
    group: "content",
    titleField: "position",
    subtitleField: "company",
    fields: [
      { key: "position", label: "Position", type: "text", required: true },
      { key: "company", label: "Company", type: "text", required: true },
      { key: "employmentType", label: "Employment type", type: "text", placeholder: "Full-time" },
      { key: "location", label: "Location", type: "text" },
      { key: "startDate", label: "Start date", type: "date", help: "Format: YYYY-MM" },
      { key: "endDate", label: "End date", type: "date", help: "Leave empty if current." },
      { key: "current", label: "Current role", type: "boolean" },
      { key: "url", label: "Company link", type: "url" },
      { key: "description", label: "Summary", type: "textarea", wide: true },
      { key: "responsibilities", label: "Responsibilities", type: "paragraphs", wide: true },
      { key: "achievements", label: "Achievements", type: "paragraphs", wide: true },
      { key: "technologies", label: "Technologies", type: "tags", wide: true },
      { key: "status", label: "Status", type: "select", options: PUBLISH_OPTIONS },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      company: "",
      position: "",
      employmentType: "Full-time",
      location: "",
      startDate: "",
      endDate: "",
      current: true,
      description: "",
      responsibilities: [],
      achievements: [],
      technologies: [],
      logo: "",
      url: "",
      status: "published",
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "projects",
    slug: "projects",
    label: "Projects",
    description: "Case studies with their own page, gallery and SEO.",
    icon: "Rocket",
    kind: "collection",
    group: "content",
    titleField: "title",
    subtitleField: "category",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "slug", label: "URL slug", type: "slug", required: true, help: "Becomes /projects/your-slug" },
      { key: "category", label: "Category", type: "text" },
      { key: "shortDescription", label: "Card description", type: "textarea", wide: true },
      { key: "fullDescription", label: "Full description", type: "richtext", wide: true },
      { key: "coverImage", label: "Cover image", type: "image", wide: true },
      { key: "technologies", label: "Technologies", type: "tags", wide: true },
      { key: "tags", label: "Tags", type: "tags", wide: true },
      { key: "year", label: "Year", type: "text" },
      { key: "role", label: "Your role", type: "text" },
      { key: "client", label: "Client / context", type: "text" },
      { key: "liveUrl", label: "Live URL", type: "url" },
      { key: "githubUrl", label: "GitHub URL", type: "url" },
      { key: "caseStudyUrl", label: "External write-up", type: "url" },
      { key: "challenge", label: "The challenge", type: "richtext", wide: true },
      { key: "solution", label: "The solution", type: "richtext", wide: true },
      { key: "process", label: "Process", type: "richtext", wide: true },
      { key: "outcome", label: "Outcome", type: "richtext", wide: true },
      { key: "seoTitle", label: "SEO title", type: "text", wide: true },
      { key: "seoDescription", label: "SEO description", type: "textarea", wide: true },
      { key: "ogImage", label: "Social share image", type: "image", wide: true },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "status", label: "Status", type: "select", options: PUBLISH_OPTIONS },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      category: "",
      tags: [],
      technologies: [],
      coverImage: "",
      gallery: [],
      videoUrl: "",
      githubUrl: "",
      liveUrl: "",
      caseStudyUrl: "",
      year: String(new Date().getFullYear()),
      client: "",
      role: "",
      challenge: "",
      solution: "",
      process: "",
      outcome: "",
      featured: false,
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      ogImage: "",
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "education",
    slug: "education",
    label: "Education",
    description: "Degrees, institutions and academic achievements.",
    icon: "GraduationCap",
    kind: "collection",
    group: "content",
    titleField: "degree",
    subtitleField: "institution",
    fields: [
      { key: "degree", label: "Degree", type: "text", required: true },
      { key: "institution", label: "Institution", type: "text", required: true },
      { key: "field", label: "Field of study", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "startDate", label: "Start date", type: "date" },
      { key: "endDate", label: "End date", type: "date" },
      { key: "grade", label: "Grade / CGPA", type: "text" },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "achievements", label: "Achievements", type: "paragraphs", wide: true },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      grade: "",
      location: "",
      description: "",
      achievements: [],
      logo: "",
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "certifications",
    slug: "certifications",
    label: "Certifications",
    description: "Credentials, workshops and published research.",
    icon: "Award",
    kind: "collection",
    group: "content",
    titleField: "title",
    subtitleField: "issuer",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, wide: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "issueDate", label: "Issued", type: "date" },
      { key: "expiryDate", label: "Expires", type: "date" },
      { key: "credentialId", label: "Credential ID", type: "text" },
      { key: "credentialUrl", label: "Verification URL", type: "url" },
      { key: "image", label: "Certificate image", type: "image", wide: true },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      title: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      image: "",
      category: "",
      description: "",
      featured: false,
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "services",
    slug: "services",
    label: "Services",
    description: "What you offer. Hidden by default — enable in Sections.",
    icon: "Workflow",
    kind: "collection",
    group: "content",
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "icon", label: "Icon", type: "select", options: ["", ...CONTENT_ICON_NAMES] },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "features", label: "Features", type: "paragraphs", wide: true },
      { key: "status", label: "Status", type: "select", options: PUBLISH_OPTIONS },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      title: "",
      description: "",
      icon: "Sparkles",
      features: [],
      status: "published",
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "testimonials",
    slug: "testimonials",
    label: "Testimonials",
    description: "Recommendations. Hidden by default — enable in Sections.",
    icon: "Quote",
    kind: "collection",
    group: "content",
    titleField: "name",
    subtitleField: "company",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "rating", label: "Rating", type: "range", min: 1, max: 5 },
      { key: "quote", label: "Quote", type: "textarea", wide: true },
      { key: "status", label: "Status", type: "select", options: PUBLISH_OPTIONS },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      name: "",
      role: "",
      company: "",
      avatar: "",
      quote: "",
      rating: 5,
      status: "published",
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "socialLinks",
    slug: "social-links",
    label: "Social Links",
    description: "Profiles shown in the hero, contact section and footer.",
    icon: "Globe",
    kind: "collection",
    group: "content",
    titleField: "platform",
    subtitleField: "handle",
    fields: [
      { key: "platform", label: "Platform", type: "text", required: true },
      { key: "icon", label: "Icon", type: "select", options: SOCIAL_ICON_NAMES },
      { key: "url", label: "URL", type: "url", required: true, wide: true },
      { key: "handle", label: "Handle", type: "text" },
      { key: "label", label: "Label", type: "text" },
      { key: "featured", label: "Show in hero", type: "boolean" },
      { key: "enabled", label: "Visible on site", type: "boolean" },
    ],
    blank: {
      platform: "",
      label: "",
      url: "",
      icon: "link",
      handle: "",
      featured: false,
      enabled: true,
    },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "resume",
    slug: "resume",
    label: "Résumé",
    description: "The downloadable CV and its button.",
    icon: "FileText",
    kind: "object",
    group: "content",
    fields: [
      { key: "enabled", label: "Show résumé button", type: "boolean" },
      { key: "buttonLabel", label: "Button label", type: "text" },
      { key: "fileUrl", label: "Résumé file", type: "file", wide: true, help: "PDF. Upload replaces the current file." },
      { key: "fileName", label: "Download filename", type: "text", wide: true },
      { key: "note", label: "Note", type: "text", wide: true },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "contact",
    slug: "contact",
    label: "Contact Section",
    description: "Heading, description and contact-form behaviour.",
    icon: "Mail",
    kind: "object",
    group: "content",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text", wide: true },
      { key: "description", label: "Description", type: "textarea", wide: true },
      { key: "formEnabled", label: "Enable contact form", type: "boolean" },
      { key: "successMessage", label: "Success message", type: "textarea", wide: true },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "navigation",
    slug: "navigation",
    label: "Navigation",
    description: "Menu links, in order.",
    icon: "Menu",
    kind: "collection",
    group: "system",
    titleField: "label",
    subtitleField: "href",
    fields: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "href", label: "Link", type: "text", required: true, help: "#section, /page or a full URL." },
      { key: "external", label: "Opens in new tab", type: "boolean" },
      { key: "enabled", label: "Visible", type: "boolean" },
    ],
    blank: { label: "", href: "#", external: false, enabled: true },
  },

  /* ---------------------------------------------------------------- */
  {
    key: "settings",
    slug: "settings",
    label: "Website Settings",
    description: "Identity, contact details, footer and maintenance mode.",
    icon: "Settings",
    kind: "object",
    group: "system",
    fields: [
      { key: "siteTitle", label: "Site title", type: "text", wide: true, required: true },
      { key: "siteDescription", label: "Site description", type: "textarea", wide: true },
      { key: "shortName", label: "Your name", type: "text" },
      { key: "logoText", label: "Logo initials", type: "text", help: "2 characters works best." },
      { key: "profileImage", label: "Profile image", type: "image", wide: true },
      { key: "favicon", label: "Favicon", type: "image", wide: true },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp / dial number", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "availabilityStatus", label: "Availability text", type: "text" },
      { key: "availabilityOpen", label: "Currently available", type: "boolean" },
      { key: "responseTime", label: "Response-time note", type: "text", wide: true },
      { key: "footerText", label: "Footer text", type: "textarea", wide: true },
      { key: "copyrightText", label: "Copyright line", type: "text", wide: true },
      { key: "maintenanceMode", label: "Maintenance mode", type: "boolean", help: "Hides the public site. Admin stays reachable." },
      { key: "maintenanceMessage", label: "Maintenance message", type: "textarea", wide: true },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "seo",
    slug: "seo",
    label: "SEO & Analytics",
    description: "Search metadata, social sharing and analytics.",
    icon: "Search",
    kind: "object",
    group: "system",
    fields: [
      { key: "defaultTitle", label: "Default title", type: "text", wide: true },
      { key: "titleTemplate", label: "Title template", type: "text", wide: true, help: "Use %s for the page name." },
      { key: "defaultDescription", label: "Default description", type: "textarea", wide: true },
      { key: "keywords", label: "Keywords", type: "tags", wide: true },
      { key: "ogImage", label: "Social share image", type: "image", wide: true, help: "1200×630 works best." },
      { key: "twitterHandle", label: "X / Twitter handle", type: "text" },
      { key: "canonicalUrl", label: "Canonical URL", type: "url" },
      { key: "robotsIndex", label: "Allow search indexing", type: "boolean" },
      { key: "structuredDataEnabled", label: "Structured data", type: "boolean" },
      { key: "analyticsProvider", label: "Analytics provider", type: "select", options: ["none", "plausible", "umami", "ga4"] },
      { key: "analyticsId", label: "Analytics ID", type: "text", help: "Umami website ID or GA4 measurement ID." },
      { key: "analyticsDomain", label: "Analytics domain", type: "text", help: "Plausible only." },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    key: "theme",
    slug: "appearance",
    label: "Appearance",
    description: "Constrained design tokens — every option stays on-brand and accessible.",
    icon: "Palette",
    kind: "object",
    group: "system",
    fields: [
      { key: "accent", label: "Accent colour", type: "select", options: ["gold", "amber", "cyan", "violet", "emerald", "rose"] },
      { key: "surface", label: "Dark surface", type: "select", options: ["navy", "slate", "charcoal"] },
      { key: "radius", label: "Corner style", type: "select", options: ["sharp", "soft", "round"] },
      { key: "density", label: "Density", type: "select", options: ["comfortable", "compact"] },
      { key: "motion", label: "Animation", type: "select", options: ["full", "subtle", "off"] },
      { key: "heroStyle", label: "Hero background", type: "select", options: ["particles", "gradient", "plain"] },
      { key: "fontScale", label: "Type scale", type: "select", options: ["sm", "md", "lg"] },
    ],
  },
];

export function moduleBySlug(slug: string): ModuleConfig | undefined {
  return MODULES.find((m) => m.slug === slug);
}
