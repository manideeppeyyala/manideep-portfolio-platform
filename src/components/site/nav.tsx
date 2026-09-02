"use client";

/**
 * Site navigation.
 *
 * Behaviours:
 *  - transparent over the navy hero, glass + border once scrolled
 *  - active section tracked with IntersectionObserver (no scroll math)
 *  - mobile drawer with focus trap, Escape to close, scroll lock, and
 *    `aria-expanded`/`aria-controls` wired up
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui";

export function SiteNav({
  items,
  logoText,
  name,
  ctaLabel,
  ctaHref,
}: {
  items: NavItem[];
  logoText: string;
  name: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ---- solid-on-scroll ------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- active section -------------------------------------------- */
  useEffect(() => {
    const ids = items
      .map((i) => i.href)
      .filter((h) => h.startsWith("#"))
      .map((h) => h.slice(1));

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  /* ---- drawer: scroll lock, Escape, focus trap -------------------- */
  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Move focus into the drawer so screen readers follow.
    drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  const linkBase =
    "relative text-sm font-medium transition-colors duration-200 text-primary-foreground/70 hover:text-primary-foreground";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 no-print",
        scrolled
          ? "border-b border-white/10 bg-navy-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-[var(--nav-h)] items-center justify-between gap-6"
      >
        {/* Logo */}
        <a href="#top" className="flex shrink-0 items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-base font-black text-accent-foreground shadow-gold transition-transform duration-300 group-hover:scale-105">
            {logoText}
          </span>
          <span className="hidden text-base font-bold text-primary-foreground sm:block">
            {name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {items.map((item) => {
            const isActive = active === item.href;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={cn(linkBase, isActive && "text-primary-foreground")}
                  aria-current={isActive ? "true" : undefined}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-accent transition-all duration-300",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          {ctaLabel && ctaHref && (
            <a href={ctaHref} className={buttonClass("primary", "sm")}>
              {ctaLabel}
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 text-primary-foreground transition-colors hover:bg-white/5 lg:hidden"
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        ref={drawerRef}
        hidden={!open}
        className="border-t border-white/10 bg-navy-950/97 backdrop-blur-xl lg:hidden"
      >
        <ul className="container-page flex flex-col gap-1 py-5">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={close}
                className={cn(
                  "block rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                  active === item.href
                    ? "bg-white/10 text-primary-foreground"
                    : "text-primary-foreground/75 hover:bg-white/5 hover:text-primary-foreground"
                )}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}

          {ctaLabel && ctaHref && (
            <li className="mt-3">
              <a
                href={ctaHref}
                onClick={close}
                className={buttonClass("primary", "md", "w-full")}
              >
                {ctaLabel}
              </a>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
