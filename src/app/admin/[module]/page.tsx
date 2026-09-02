/**
 * Generic CMS module page.
 *
 * One route serves every content module — the config in `admin-config.ts`
 * decides the fields, the shape and the save target. Adding a module means
 * adding a config entry, not a new page.
 *
 * `messages`, `sections` and `activity` have bespoke routes and are
 * excluded here.
 */

import { notFound } from "next/navigation";
import { moduleBySlug, MODULES } from "@/lib/admin-config";
import { getContent, getMessages } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { ModuleEditor } from "@/components/admin/module-editor";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: slug } = await params;
  const config = moduleBySlug(slug);

  if (!config) notFound();

  const [content, messages] = await Promise.all([getContent(), getMessages()]);
  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <AdminShell unreadCount={unread}>
      <ModuleEditor config={config} initialValue={content[config.key]} />
    </AdminShell>
  );
}
