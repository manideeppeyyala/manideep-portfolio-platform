"use client";

/**
 * Admin form controls.
 *
 * One component per field type, chosen by `admin-config.ts`. Each control
 * is fully labelled and describable, so the admin is keyboard- and
 * screen-reader-usable like the public site.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import type { Field } from "@/lib/admin-config";
import { cn, slugifyInput } from "@/components/admin/helpers";

const inputBase =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground " +
  "placeholder:text-muted-foreground/60 transition-colors " +
  "focus:border-primary-glow focus:outline-none focus:ring-2 focus:ring-primary-glow/20";

/* ------------------------------------------------------------------ */
/* Tags (string[])                                                     */
/* ------------------------------------------------------------------ */

function TagsInput({
  value,
  onChange,
  id,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  id: string;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder="Type and press Enter"
          className={inputBase}
        />
        <button
          type="button"
          onClick={commit}
          className="shrink-0 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <li key={`${tag}-${i}`}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium">
                {tag}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, index) => index !== i))}
                  aria-label={`Remove ${tag}`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X size={12} aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Paragraphs (string[] of longer text)                                */
/* ------------------------------------------------------------------ */

function ParagraphsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="space-y-2.5">
      {value.map((paragraph, i) => (
        <div key={i} className="flex gap-2">
          <textarea
            value={paragraph}
            rows={2}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className={cn(inputBase, "resize-y")}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, index) => index !== i))}
            aria-label={`Remove item ${i + 1}`}
            className="shrink-0 self-start rounded-lg border border-border p-2.5 text-muted-foreground hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 size={15} aria-hidden />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary-glow/50 hover:text-foreground"
      >
        <Plus size={14} aria-hidden />
        Add item
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Media upload                                                        */
/* ------------------------------------------------------------------ */

function MediaInput({
  value,
  onChange,
  id,
  accept,
  preview,
}: {
  value: string;
  onChange: (next: string) => void;
  id: string;
  accept: string;
  preview: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange(json.url);
    } catch {
      setError("Upload failed — check your connection.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/file.jpg or a full URL"
          className={inputBase}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={14} aria-hidden className="animate-spin" />
          ) : (
            <Upload size={14} aria-hidden />
          )}
          Upload
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}

      {preview && value && (
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted">
          {/* Unoptimised: the source may be an arbitrary admin-entered URL. */}
          <Image
            src={value}
            alt=""
            width={200}
            height={120}
            unoptimized
            className="h-28 w-auto object-cover"
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Field dispatcher                                                    */
/* ------------------------------------------------------------------ */

export function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = `field-${field.key}`;
  const describedBy = field.help ? `${id}-help` : undefined;

  const control = (() => {
    switch (field.type) {
      case "boolean":
        return (
          <label className="inline-flex cursor-pointer items-center gap-3">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              aria-describedby={describedBy}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2">
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
            </span>
            <span className="text-sm text-muted-foreground">
              {value ? "On" : "Off"}
            </span>
          </label>
        );

      case "select":
        return (
          <select
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={describedBy}
            className={inputBase}
          >
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option === "" ? "— none —" : option}
              </option>
            ))}
          </select>
        );

      case "range":
        return (
          <div className="flex items-center gap-4">
            <input
              id={id}
              type="range"
              min={field.min ?? 0}
              max={field.max ?? 100}
              value={Number(value ?? 0)}
              onChange={(e) => onChange(Number(e.target.value))}
              aria-describedby={describedBy}
              className="flex-1 accent-[var(--color-primary)]"
            />
            <span className="w-12 text-right text-sm font-semibold tabular-nums">
              {Number(value ?? 0)}
            </span>
          </div>
        );

      case "number":
        return (
          <input
            id={id}
            type="number"
            value={Number(value ?? 0)}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-describedby={describedBy}
            className={inputBase}
          />
        );

      case "textarea":
        return (
          <textarea
            id={id}
            rows={3}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-describedby={describedBy}
            className={cn(inputBase, "resize-y")}
          />
        );

      case "richtext":
        return (
          <textarea
            id={id}
            rows={6}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-describedby={describedBy}
            className={cn(inputBase, "resize-y")}
          />
        );

      case "tags":
        return (
          <TagsInput
            id={id}
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
          />
        );

      case "paragraphs":
        return (
          <ParagraphsInput
            value={Array.isArray(value) ? (value as string[]) : []}
            onChange={onChange}
          />
        );

      case "image":
        return (
          <MediaInput
            id={id}
            value={String(value ?? "")}
            onChange={onChange}
            accept="image/*"
            preview
          />
        );

      case "file":
        return (
          <MediaInput
            id={id}
            value={String(value ?? "")}
            onChange={onChange}
            accept="application/pdf"
            preview={false}
          />
        );

      case "slug":
        return (
          <input
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(slugifyInput(e.target.value))}
            placeholder="my-project"
            aria-describedby={describedBy}
            className={cn(inputBase, "font-mono")}
          />
        );

      case "date":
        return (
          <input
            id={id}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder="2025-09"
            aria-describedby={describedBy}
            className={inputBase}
          />
        );

      default:
        return (
          <input
            id={id}
            type="text"
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            aria-describedby={describedBy}
            className={inputBase}
          />
        );
    }
  })();

  return (
    <div className={field.wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {field.label}
        {field.required && <span className="ml-0.5 text-destructive">*</span>}
      </label>

      {control}

      {field.help && (
        <p id={describedBy} className="mt-1.5 text-xs text-muted-foreground">
          {field.help}
        </p>
      )}
    </div>
  );
}
