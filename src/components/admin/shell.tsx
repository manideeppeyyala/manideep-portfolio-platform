"use client";

/**
 * Admin shell — sidebar + topbar.
 *
 * The public site's brand language, retuned for productivity: denser type,
 * a persistent nav, and no decorative motion competing with the work.
 */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import {
  Award,
  Boxes,
  Briefcase,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Palette,
  Quote,
  Rocket,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { MODULES } from "@/lib/admin-config";
import { cn } from "./helpers";

const ICONS: Record<string, LucideIcon> = {
  Award,
  Boxes,
  Briefcase,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquare,
  Palette,
  Quote,
  Rocket,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Workflow,
};

/**
 * Defined at module scope, not inside `AdminShell` — a component created
 * during render is a brand-new type on every render, so React unmounts and
 * remounts the whole subtree each time (losing focus and state).
 */
function NavLink({
  href,
  icon,
  label,
  badge,
  activePath,
  onNavigate,
}: {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  activePath: string;
  onNavigate: () => void;
}) {
  const active = activePath === href;
  const Icon = ICONS[icon] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon size={16} aria-hidden className="shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge ? (
        <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function AdminShell({
  children,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const contentModules = MODULES.filter((m) => m.group === "content");
  const systemModules = MODULES.filter((m) => m.group === "system");

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <div className="space-y-1">
        <NavLink
          href="/admin"
          icon="LayoutDashboard"
          label="Dashboard"
          activePath={pathname}
          onNavigate={close}
        />
        <NavLink
          href="/admin/messages"
          icon="Mail"
          label="Contact Messages"
          badge={unreadCount}
          activePath={pathname}
          onNavigate={close}
        />
      </div>

      <div>
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
          Content
        </p>
        <div className="space-y-1">
          {contentModules.map((m) => (
            <NavLink
              key={m.slug}
              href={`/admin/${m.slug}`}
              icon={m.icon}
              label={m.label}
              activePath={pathname}
              onNavigate={close}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
          System
        </p>
        <div className="space-y-1">
          {systemModules.map((m) => (
            <NavLink
              key={m.slug}
              href={`/admin/${m.slug}`}
              icon={m.icon}
              label={m.label}
              activePath={pathname}
              onNavigate={close}
            />
          ))}
          <NavLink
            href="/admin/sections"
            icon="Boxes"
            label="Sections"
            activePath={pathname}
            onNavigate={close}
          />
          <NavLink
            href="/admin/activity"
            icon="MessageSquare"
            label="Activity Log"
            activePath={pathname}
            onNavigate={close}
          />
        </div>
      </div>

      <div className="mt-auto space-y-1 border-t border-border pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink size={16} aria-hidden />
          View site
        </a>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={16} aria-hidden />
          Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="admin-sidebar"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border lg:hidden"
          >
            {open ? <X size={17} aria-hidden /> : <Menu size={17} aria-hidden />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-black text-accent">
              PM
            </span>
            <span className="text-sm font-bold text-foreground">Portfolio CMS</span>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-border bg-card lg:block">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 top-14 z-30 lg:hidden">
            <button
              aria-label="Close menu"
              className="absolute inset-0 bg-navy-950/40"
              onClick={close}
            />
            <aside
              id="admin-sidebar"
              className="absolute inset-y-0 left-0 w-72 border-r border-border bg-card"
            >
              {sidebar}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
