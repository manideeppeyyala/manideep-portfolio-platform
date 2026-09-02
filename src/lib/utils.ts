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

/** Absolute site URL — never hard-code the production domain. */
export function siteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return path ? `${base}${path.startsWith("/") ? path : `/${path}`}` : base;
}
