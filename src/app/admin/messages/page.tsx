import { getMessages } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => m.status === "new").length;

  return (
    <AdminShell unreadCount={unread}>
      <MessagesInbox initialMessages={messages} />
    </AdminShell>
  );
}
