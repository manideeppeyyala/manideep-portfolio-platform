"use client";

/**
 * Section visibility + ordering.
 *
 * These two controls decide what the public page renders and in what
 * order — `page.tsx` composes itself from exactly this list, so a change
 * here genuinely restructures the site rather than just hiding things
 * with CSS.
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Save } from "lucide-react";
import type { SectionConfig } from "@/lib/schema";
import { cn, useToast } from "./helpers";

export function SectionsManager({ initialSections }: { initialSections: SectionConfig[] }) {
  const [sections, setSections] = useState(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next.map((s, i) => ({ ...s, order: i })));
    setDirty(true);
  }

  function toggle(key: string) {
    setSections((current) =>
      current.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s))
    );
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "sections", value: sections }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.push("error", body.error ?? "Save failed.");
        return;
      }

      setDirty(false);
      toast.push("success", "Section layout saved.");
    } catch {
      toast.push("error", "Couldn't reach the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sections</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Show, hide and reorder the sections of your public page. The hero is best left first.
          </p>
        </div>

        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={15} aria-hidden className="animate-spin" />
          ) : (
            <Save size={15} aria-hidden />
          )}
          Save changes
        </button>
      </header>

      <ol className="mt-6 space-y-2.5">
        {sections.map((section, index) => (
          <li
            key={section.key}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card p-4",
              !section.enabled && "opacity-60"
            )}
          >
            <span className="w-6 text-center text-sm font-bold tabular-nums text-muted-foreground">
              {index + 1}
            </span>

            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${section.label} up`}
                className="text-muted-foreground hover:text-foreground disabled:opacity-25"
              >
                <ChevronUp size={15} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                aria-label={`Move ${section.label} down`}
                className="text-muted-foreground hover:text-foreground disabled:opacity-25"
              >
                <ChevronDown size={15} aria-hidden />
              </button>
            </div>

            <span className="flex-1 font-semibold text-foreground">{section.label}</span>

            <span className="hidden font-mono text-xs text-muted-foreground sm:block">
              #{section.key}
            </span>

            <button
              type="button"
              onClick={() => toggle(section.key)}
              aria-pressed={section.enabled}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors",
                section.enabled
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {section.enabled ? (
                <>
                  <Eye size={13} aria-hidden />
                  Visible
                </>
              ) : (
                <>
                  <EyeOff size={13} aria-hidden />
                  Hidden
                </>
              )}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
