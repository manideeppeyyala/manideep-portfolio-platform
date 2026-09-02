"use client";

/**
 * Contact message inbox.
 *
 * Status changes apply optimistically — the row updates instantly and
 * rolls back if the server rejects it, so triaging a full inbox doesn't
 * mean waiting on a round-trip per click.
 */

import { useState } from "react";
import { Archive, CornerUpLeft, Mail, MailOpen, Search, Trash2 } from "lucide-react";
import type { ContactMessage, MessageStatus } from "@/lib/schema";
import { formatRelative } from "@/lib/utils";
import { cn, ConfirmDialog, useToast } from "./helpers";

const FILTERS: Array<{ value: MessageStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
  { value: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<MessageStatus, string> = {
  new: "bg-accent/20 text-accent-foreground",
  read: "bg-muted text-muted-foreground",
  replied: "bg-success/10 text-success",
  archived: "bg-muted text-muted-foreground/70",
};

export function MessagesInbox({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [filter, setFilter] = useState<MessageStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const toast = useToast();

  const shown = messages.filter((message) => {
    if (filter !== "all" && message.status !== filter) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [message.name, message.email, message.subject, message.message]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  async function setStatus(id: string, status: MessageStatus) {
    const previous = messages;
    setMessages((current) =>
      current.map((m) => (m.id === id ? { ...m, status } : m))
    );

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        setMessages(previous);
        toast.push("error", "Couldn't update that message.");
      }
    } catch {
      setMessages(previous);
      toast.push("error", "Couldn't reach the server.");
    }
  }

  async function remove(id: string) {
    const previous = messages;
    setMessages((current) => current.filter((m) => m.id !== id));
    setPendingDelete(null);

    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setMessages(previous);
        toast.push("error", "Couldn't delete that message.");
        return;
      }
      toast.push("success", "Message deleted.");
    } catch {
      setMessages(previous);
      toast.push("error", "Couldn't reach the server.");
    }
  }

  function open(message: ContactMessage) {
    const next = expanded === message.id ? null : message.id;
    setExpanded(next);
    if (next && message.status === "new") void setStatus(message.id, "read");
  }

  return (
    <div>
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Contact Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} total · {messages.filter((m) => m.status === "new").length} unread
        </p>
      </header>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((option) => {
            const count =
              option.value === "all"
                ? messages.length
                : messages.filter((m) => m.status === option.value).length;
            return (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-56">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages…"
            aria-label="Search messages"
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:border-primary-glow focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      {shown.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
          <Mail size={24} aria-hidden className="mx-auto text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">
            {messages.length === 0 ? "No messages yet" : "Nothing matches that filter"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.length === 0
              ? "Messages sent through the contact form will appear here."
              : "Try a different filter or clear the search."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {shown.map((message) => {
            const isOpen = expanded === message.id;

            return (
              <li
                key={message.id}
                className={cn(
                  "overflow-hidden rounded-xl border bg-card transition-colors",
                  isOpen ? "border-primary-glow/40" : "border-border",
                  message.status === "new" && "border-l-4 border-l-accent"
                )}
              >
                <div className="flex items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => open(message)}
                    aria-expanded={isOpen}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{message.name}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                          STATUS_STYLES[message.status]
                        )}
                      >
                        {message.status}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                      {message.subject || message.message.slice(0, 80)}
                    </span>
                  </button>

                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
                    {formatRelative(message.createdAt)}
                  </span>
                </div>

                {isOpen && (
                  <div className="border-t border-border bg-muted/30 p-5">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          From
                        </dt>
                        <dd className="mt-0.5 text-sm text-foreground">{message.name}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Email
                        </dt>
                        <dd className="mt-0.5 text-sm">
                          <a
                            href={`mailto:${message.email}`}
                            className="break-all text-primary hover:underline"
                          >
                            {message.email}
                          </a>
                        </dd>
                      </div>
                      {message.subject && (
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Subject
                          </dt>
                          <dd className="mt-0.5 text-sm text-foreground">{message.subject}</dd>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Message
                        </dt>
                        <dd className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {message.message}
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${message.email}?subject=${encodeURIComponent(
                          message.subject ? `Re: ${message.subject}` : "Re: your message"
                        )}`}
                        onClick={() => void setStatus(message.id, "replied")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
                      >
                        <CornerUpLeft size={14} aria-hidden />
                        Reply
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          void setStatus(message.id, message.status === "read" ? "new" : "read")
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        {message.status === "read" ? (
                          <>
                            <Mail size={14} aria-hidden />
                            Mark unread
                          </>
                        ) : (
                          <>
                            <MailOpen size={14} aria-hidden />
                            Mark read
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => void setStatus(message.id, "archived")}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <Archive size={14} aria-hidden />
                        Archive
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingDelete(message.id)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive"
                      >
                        <Trash2 size={14} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this message?"
        description="This permanently removes it. It can't be undone from here."
        onConfirm={() => pendingDelete && void remove(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
