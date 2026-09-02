import { getContent, getMessages } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { SectionsManager } from "@/components/admin/sections-manager";

export const dynamic = "force-dynamic";

export default async function SectionsPage() {
  const [content, messages] = await Promise.all([getContent(), getMessages()]);

  return (
    <AdminShell unreadCount={messages.filter((m) => m.status === "new").length}>
      <SectionsManager initialSections={content.sections} />
    </AdminShell>
  );
}
