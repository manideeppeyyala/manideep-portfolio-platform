"use client";

/**
 * The CMS editor.
 *
 * One component serves every module. `kind: "object"` renders a single
 * form; `kind: "collection"` renders a reorderable list where each row
 * expands into the same generated form.
 *
 * Save semantics: the whole module is written in one request, so a save is
 * atomic — you never end up with half a collection persisted.
 */

import { useCallback, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/admin-config";
import { FieldControl } from "./fields";
import { cn, ConfirmDialog, useToast } from "./helpers";

type Row = Record<string, unknown>;

function newId(): string {
  return `id_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function ModuleEditor({
  config,
  initialValue,
}: {
  config: ModuleConfig;
  initialValue: unknown;
}) {
  const isCollection = config.kind === "collection";

  const [value, setValue] = useState<unknown>(initialValue);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const toast = useToast();

  const rows = useMemo<Row[]>(
    () => (isCollection && Array.isArray(value) ? (value as Row[]) : []),
    [isCollection, value]
  );

  const object = useMemo<Row>(
    () => (!isCollection && value && typeof value === "object" ? (value as Row) : {}),
    [isCollection, value]
  );

  /* ---- mutations ------------------------------------------------- */

  const updateObjectField = useCallback((key: string, next: unknown) => {
    setValue((current: unknown) => ({ ...(current as Row), [key]: next }));
    setDirty(true);
  }, []);

  const updateRowField = useCallback((rowId: string, key: string, next: unknown) => {
    setValue((current: unknown) =>
      (current as Row[]).map((row) => (row.id === rowId ? { ...row, [key]: next } : row))
    );
    setDirty(true);
  }, []);

  const addRow = useCallback(() => {
    const id = newId();
    const blank = { ...(config.blank ?? {}), id, order: rows.length };
    setValue((current: unknown) => [...(current as Row[]), blank]);
    setOpenRow(id);
    setDirty(true);
  }, [config.blank, rows.length]);

  const deleteRow = useCallback((rowId: string) => {
    setValue((current: unknown) =>
      (current as Row[])
        .filter((row) => row.id !== rowId)
        .map((row, index) => ({ ...row, order: index }))
    );
    setPendingDelete(null);
    setDirty(true);
  }, []);

  /** Moves a row and renumbers `order` so the stored value stays canonical. */
  const moveRow = useCallback((index: number, direction: -1 | 1) => {
    setValue((current: unknown) => {
      const list = [...(current as Row[])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return list;

      [list[index], list[target]] = [list[target], list[index]];
      return list.map((row, i) => ({ ...row, order: i }));
    });
    setDirty(true);
  }, []);

  /* ---- save ------------------------------------------------------ */

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: config.key, value }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.push("error", body.error ?? "Save failed.");
        return;
      }

      setDirty(false);
      toast.push("success", `${config.label} saved — the live site is updated.`);
    } catch {
      toast.push("error", "Couldn't reach the server. Check your connection.");
    } finally {
      setSaving(false);
    }
  }

  /* ---- row helpers ----------------------------------------------- */

  function rowTitle(row: Row): string {
    const raw = config.titleField ? row[config.titleField] : undefined;
    const text = typeof raw === "string" ? raw.trim() : "";
    return text || "Untitled";
  }

  function rowSubtitle(row: Row): string {
    const raw = config.subtitleField ? row[config.subtitleField] : undefined;
    return typeof raw === "string" ? raw : "";
  }

  return (
    <div className="pb-24">
      {/* ---- Header ---- */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{config.label}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>

        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-xs font-medium text-warning">Unsaved changes</span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={15} aria-hidden className="animate-spin" />
            ) : (
              <Save size={15} aria-hidden />
            )}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {/* ---- Object form ---- */}
      {!isCollection && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <FieldControl
              key={field.key}
              field={field}
              value={object[field.key]}
              onChange={(next) => updateObjectField(field.key, next)}
            />
          ))}
        </div>
      )}

      {/* ---- Collection ---- */}
      {isCollection && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {rows.length} {rows.length === 1 ? "item" : "items"}
            </p>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
            >
              <Plus size={15} aria-hidden />
              Add {config.label.replace(/s$/, "")}
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
              <p className="font-semibold text-foreground">Nothing here yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first {config.label.replace(/s$/, "").toLowerCase()} to get started.
              </p>
              <button
                type="button"
                onClick={addRow}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-deep"
              >
                <Plus size={15} aria-hidden />
                Add one
              </button>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {rows.map((row, index) => {
                const id = String(row.id);
                const isOpen = openRow === id;
                const hidden = row.enabled === false;

                return (
                  <li
                    key={id}
                    className={cn(
                      "overflow-hidden rounded-xl border bg-card transition-colors",
                      isOpen ? "border-primary-glow/40" : "border-border",
                      hidden && "opacity-60"
                    )}
                  >
                    {/* Row header */}
                    <div className="flex items-center gap-2 p-3">
                      <span aria-hidden className="text-muted-foreground/40">
                        <GripVertical size={16} />
                      </span>

                      <div className="flex shrink-0 flex-col">
                        <button
                          type="button"
                          onClick={() => moveRow(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${rowTitle(row)} up`}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                        >
                          <ChevronUp size={14} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveRow(index, 1)}
                          disabled={index === rows.length - 1}
                          aria-label={`Move ${rowTitle(row)} down`}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                        >
                          <ChevronDown size={14} aria-hidden />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenRow(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {rowTitle(row)}
                        </span>
                        {rowSubtitle(row) && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {rowSubtitle(row)}
                          </span>
                        )}
                      </button>

                      {typeof row.status === "string" && (
                        <span
                          className={cn(
                            "hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline",
                            row.status === "published"
                              ? "bg-success/10 text-success"
                              : row.status === "draft"
                                ? "bg-warning/15 text-warning"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {row.status}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => updateRowField(id, "enabled", row.enabled === false)}
                        aria-label={hidden ? `Show ${rowTitle(row)}` : `Hide ${rowTitle(row)}`}
                        title={hidden ? "Hidden on site" : "Visible on site"}
                        className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {hidden ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPendingDelete(id)}
                        aria-label={`Delete ${rowTitle(row)}`}
                        className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={15} aria-hidden />
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpenRow(isOpen ? null : id)}
                        aria-label={isOpen ? "Collapse" : "Expand"}
                        className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <ChevronDown
                          size={16}
                          aria-hidden
                          className={cn("transition-transform", isOpen && "rotate-180")}
                        />
                      </button>
                    </div>

                    {/* Row form */}
                    {isOpen && (
                      <div className="grid gap-5 border-t border-border bg-muted/30 p-5 sm:grid-cols-2">
                        {config.fields.map((field) => (
                          <FieldControl
                            key={field.key}
                            field={field}
                            value={row[field.key]}
                            onChange={(next) => updateRowField(id, field.key, next)}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Sticky save bar — the list can be long; the action shouldn't scroll away. */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
            <p className="text-sm text-muted-foreground">You have unsaved changes.</p>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-deep disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={15} aria-hidden className="animate-spin" />
              ) : (
                <Save size={15} aria-hidden />
              )}
              Save
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this item?"
        description="It's removed from the editor immediately, but only permanent once you save."
        onConfirm={() => pendingDelete && deleteRow(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
