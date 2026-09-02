import { History } from "lucide-react";
import { getActivity, getMessages } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { formatRelative } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const [activity, messages] = await Promise.all([getActivity(), getMessages()]);

  return (
    <AdminShell unreadCount={messages.filter((m) => m.status === "new").length}>
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Activity Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The last {activity.length} changes made through the admin. Every content save is also a
          commit in your GitHub repository, which is the complete history.
        </p>
      </header>

      {activity.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
          <History size={24} aria-hidden className="mx-auto text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">No activity yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes you make in the admin will be logged here.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {activity.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{entry.action}</p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{entry.module}</p>
              </div>
              <time
                dateTime={entry.at}
                className="shrink-0 text-xs text-muted-foreground"
                title={new Date(entry.at).toLocaleString()}
              >
                {formatRelative(entry.at)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
