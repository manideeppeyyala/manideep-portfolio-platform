/**
 * Admin dashboard.
 *
 * At-a-glance state of the site: content counts, message inbox health,
 * publish status and recent activity — every number computed from real
 * stored data, never hard-coded.
 */

import Link from "next/link";
import {
  Award,
  Boxes,
  Briefcase,
  CircleAlert,
  Inbox,
  Rocket,
  TriangleAlert,
} from "lucide-react";
import { getActivity, getContent, getMessages, isRemoteStore } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { formatRelative } from "@/lib/utils";
import { isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [content, messages, activity] = await Promise.all([
    getContent(),
    getMessages(),
    getActivity(),
  ]);

  const unread = messages.filter((m) => m.status === "new").length;

  const stats = [
    {
      label: "Projects",
      value: content.projects.length,
      sub: `${content.projects.filter((p) => p.status === "published").length} published`,
      href: "/admin/projects",
      icon: Rocket,
    },
    {
      label: "Skills",
      value: content.skills.length,
      sub: `${content.skillCategories.length} categories`,
      href: "/admin/skills",
      icon: Boxes,
    },
    {
      label: "Experience",
      value: content.experience.length,
      sub: `${content.education.length} education entries`,
      href: "/admin/experience",
      icon: Briefcase,
    },
    {
      label: "Certifications",
      value: content.certifications.length,
      sub: `${content.certifications.filter((c) => c.featured).length} featured`,
      href: "/admin/certifications",
      icon: Award,
    },
  ];

  /* Setup warnings — surfaced here rather than failing silently later. */
  const warnings: string[] = [];
  if (!isAuthConfigured()) {
    warnings.push(
      "ADMIN_PASSWORD_HASH / AUTH_SECRET aren't both set. Admin sign-in won't work in production."
    );
  }
  if (!isRemoteStore()) {
    warnings.push(
      "GitHub storage isn't configured — edits are saving to local files only. Set GITHUB_OWNER, GITHUB_REPO and GITHUB_TOKEN for production."
    );
  }
  if (content.settings.maintenanceMode) {
    warnings.push("Maintenance mode is ON — the public site is hidden from visitors.");
  }

  return (
    <AdminShell unreadCount={unread}>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {content.settings.shortName} · {content.projects.length} projects ·{" "}
            {messages.length} messages
          </p>
        </header>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warning) => (
              <p
                key={warning}
                className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 p-3.5 text-sm text-foreground"
              >
                <TriangleAlert size={16} aria-hidden className="mt-0.5 shrink-0 text-warning" />
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary-glow/40 hover:shadow-card"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-accent">
                  <stat.icon size={16} aria-hidden />
                </span>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-foreground">{stat.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.sub}</p>
            </Link>
          ))}
        </div>

        {/* Inbox + activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-foreground">
                <Inbox size={16} aria-hidden />
                Inbox
              </h2>
              <Link
                href="/admin/messages"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {messages.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="text-2xl font-black text-foreground">{unread}</span> unread of{" "}
                  {messages.length}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {messages.slice(0, 4).map((message) => (
                    <li key={message.id} className="flex items-start gap-3 text-sm">
                      {message.status === "new" && (
                        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-foreground">
                          {message.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {message.subject || message.message.slice(0, 60)}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelative(message.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 font-bold text-foreground">
              <CircleAlert size={16} aria-hidden />
              Recent activity
            </h2>

            {activity.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                Nothing logged yet. Edits you make will show up here.
              </p>
            ) : (
              <ul className="mt-4 space-y-2.5">
                {activity.slice(0, 6).map((entry) => (
                  <li key={entry.id} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-foreground">{entry.action}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelative(entry.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
