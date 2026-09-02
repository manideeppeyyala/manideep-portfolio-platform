/**
 * Site footer + back-to-top control.
 */

import { ArrowUp } from "lucide-react";
import type { NavItem, SiteSettings, SocialLink } from "@/lib/schema";
import { live } from "@/lib/schema";
import { SocialIcon } from "./social-icon";

export function SiteFooter({
  settings,
  socials,
  navigation,
}: {
  settings: SiteSettings;
  socials: SocialLink[];
  navigation: NavItem[];
}) {
  const visibleSocials = live(socials);
  const links = live(navigation);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card no-print">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-black text-accent">
                {settings.logoText}
              </span>
              <span className="text-base font-bold text-foreground">{settings.shortName}</span>
            </div>

            {settings.footerText && (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {settings.footerText}
              </p>
            )}

            {visibleSocials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {visibleSocials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target={social.url.startsWith("http") ? "_blank" : undefined}
                      rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={social.label || social.platform}
                      className="grid h-10 w-10 place-items-center rounded-lg border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-glow/50 hover:text-primary"
                    >
                      <SocialIcon name={social.icon || social.platform} size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Navigation */}
          {links.length > 0 && (
            <nav aria-label="Footer">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Explore
              </h2>
              <ul className="mt-4 space-y-2.5">
                {links.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Contact */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Get in touch
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {settings.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="break-all text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a
                    href={`tel:${settings.whatsapp || settings.phone}`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.location && (
                <li className="text-muted-foreground">{settings.location}</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {year} {settings.copyrightText}
          </p>

          <a
            href="#top"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-glow/50 hover:text-foreground"
          >
            Back to top
            <ArrowUp size={13} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
