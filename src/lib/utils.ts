/** Small shared helpers. Kept dependency-free on purpose. */

/** Conditional className joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Formats a stored date-ish string for display.
 * Accepts "2025-09", "2025-09-01", "" or free text and never throws.
 */
export function formatDate(value: string, opts: { month?: "short" | "long" } = {}): string {
  const raw = (value ?? "").trim();
  if (!raw) return "";

  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(raw);
  if (!match) return raw; // already human-written, e.g. "Present"

  const [, year, month] = match;
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleDateString("en-US", {
    month: opts.month ?? "short",
    year: "numeric",
  });
}

/** "Sep 2025 — Present" */
export function formatRange(start: string, end: string, current: boolean): string {
  const from = formatDate(start);
  const to = current ? "Present" : formatDate(end);
  if (from && to) return `${from} — ${to}`;
  return from || to || "";
}

export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Absolute site URL — never hard-code the production domain.
 *
 * Resolution order matters:
 *  1. NEXT_PUBLIC_SITE_URL          — an explicit override (a custom domain)
 *  2. VERCEL_PROJECT_PRODUCTION_URL — the project's *stable* production
 *                                     domain, e.g. my-site.vercel.app
 *  3. VERCEL_URL                    — the per-deployment URL, which changes
 *                                     on every build (…-cs6sn2i1o.vercel.app)
 *  4. localhost
 *
 * (2) is what makes canonical tags, OpenGraph URLs and sitemap.xml correct
 * out of the box. Falling straight through to (3) meant every deploy
 * published a different canonical URL — bad for SEO and for link previews,
 * and easy to miss because the site itself still looks fine.
 */
export function siteUrl(path = ""): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const deploymentDomain = process.env.VERCEL_URL?.trim();

  const base = (
    explicit ||
    (productionDomain ? `https://${productionDomain}` : "") ||
    (deploymentDomain ? `https://${deploymentDomain}` : "") ||
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return path ? `${base}${path.startsWith("/") ? path : `/${path}`}` : base;
}
