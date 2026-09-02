/**
 * Social / brand icons.
 *
 * Hand-authored SVG paths rather than an icon package: lucide-react v1
 * removed brand glyphs entirely, and pulling in a second icon library for
 * six logos isn't worth the bytes. These are simple, uniform 24×24 paths
 * that inherit `currentColor`.
 *
 * Content stores an icon *name*, so the admin can add a social link
 * without a code change. Unknown names fall back to a generic link glyph.
 */

import { Globe, Link as LinkIcon, Mail, MessageCircle, Phone } from "lucide-react";

type BrandProps = { size: number; className?: string };

function Svg({
  size,
  className,
  children,
  filled = true,
}: BrandProps & { children: React.ReactNode; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? undefined : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const GithubIcon = (p: BrandProps) => (
  <Svg {...p}>
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </Svg>
);

const LinkedinIcon = (p: BrandProps) => (
  <Svg {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
  </Svg>
);

const InstagramIcon = (p: BrandProps) => (
  <Svg {...p} filled={false}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

const YoutubeIcon = (p: BrandProps) => (
  <Svg {...p}>
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
  </Svg>
);

const FacebookIcon = (p: BrandProps) => (
  <Svg {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96H15.83c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07Z" />
  </Svg>
);

const XIcon = (p: BrandProps) => (
  <Svg {...p}>
    <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z" />
  </Svg>
);

type IconComponent = (props: BrandProps) => React.ReactElement;

const ICONS: Record<string, IconComponent> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  twitter: XIcon,
  x: XIcon,
  mail: (p) => <Mail size={p.size} className={p.className} aria-hidden />,
  email: (p) => <Mail size={p.size} className={p.className} aria-hidden />,
  phone: (p) => <Phone size={p.size} className={p.className} aria-hidden />,
  whatsapp: (p) => <MessageCircle size={p.size} className={p.className} aria-hidden />,
  website: (p) => <Globe size={p.size} className={p.className} aria-hidden />,
  portfolio: (p) => <Globe size={p.size} className={p.className} aria-hidden />,
  link: (p) => <LinkIcon size={p.size} className={p.className} aria-hidden />,
};

/** Names offered in the admin's social-icon picker. */
export const SOCIAL_ICON_NAMES = Object.keys(ICONS);

export function SocialIcon({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[name.trim().toLowerCase()] ?? ICONS.link;
  return <Icon size={size} className={className} />;
}
