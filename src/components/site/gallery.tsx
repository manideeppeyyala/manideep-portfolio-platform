"use client";

/**
 * Gallery — moments, milestones and achievements.
 *
 * A masonry-ish mosaic of portrait tiles that open into a full-screen
 * lightbox, following the reference's "research life" flow. Featured
 * items span two columns so the grid never reads as a flat sheet.
 *
 * Supports both images and video: an item with `video` set renders a play
 * affordance on the tile and a <video> element in the lightbox, with the
 * image acting as the poster frame.
 *
 * Lightbox accessibility: focus moves in on open and returns to the tile
 * on close, Escape closes, arrow keys move between items, and the
 * background is inert to pointer events behind the dialog.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, Play, X } from "lucide-react";
import type { GalleryItem } from "@/lib/schema";
import { live } from "@/lib/schema";
import { EmptyState, SectionHeader } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import { Reveal } from "./motion";

export function GallerySection({ items }: { items: GalleryItem[] }) {
  const shown = live(items);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    const previous = openIndex;
    setOpenIndex(null);
    if (previous !== null) triggerRefs.current[previous]?.focus();
  }, [openIndex]);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + delta + shown.length) % shown.length;
      });
    },
    [shown.length]
  );

  /* Keyboard + scroll lock while the lightbox is open. */
  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  if (!shown.length) {
    return (
      <section id="gallery" className="bg-soft relative overflow-hidden section-y">
        <div className="container-page">
          <Reveal>
            <SectionHeader
              eyebrow="Gallery"
              title="Career milestones."
              description="Graduation, conferences, onboarding and moments from working life."
            />
          </Reveal>
          <EmptyState
            className="mt-12"
            icon={<ImageOff size={26} aria-hidden />}
            title="No photos yet"
            description="Add career photos and videos from Admin → Gallery."
          />
        </div>
      </section>
    );
  }

  const active = openIndex !== null ? shown[openIndex] : null;

  return (
    <section id="gallery" className="bg-soft relative overflow-hidden section-y">
      <div className="container-page">
        <Reveal>
          <SectionHeader
            eyebrow="Gallery"
            title="Career milestones."
            description="Graduation, conferences, onboarding and moments from working life — the milestones behind the résumé."
          />
        </Reveal>

        <div
          className={cn(
            "mt-14 grid auto-rows-[minmax(0,1fr)] gap-4",
            // Few items would look stranded in a four-up grid, so the
            // column count follows the content rather than the breakpoint.
            shown.length <= 2
              ? "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2"
              : shown.length <= 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {shown.map((item, index) => (
            <Reveal
              key={item.id}
              delay={Math.min(index * 0.05, 0.35)}
              className={cn(item.featured && shown.length > 3 && "sm:col-span-2 sm:row-span-2")}
            >
              <button
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open: ${item.title || "gallery item"}`}
                className="group shine-on-hover relative block h-full w-full overflow-hidden rounded-2xl border border-border bg-muted text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-gold"
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden",
                    item.featured ? "aspect-square sm:aspect-[4/5]" : "aspect-[3/4]"
                  )}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title || ""}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground">
                      <ImageOff size={22} aria-hidden />
                    </div>
                  )}

                  {/* Legibility scrim */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {item.video && (
                    <span
                      aria-hidden
                      className="animate-halo absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-accent-foreground shadow-gold"
                    >
                      <Play size={18} fill="currentColor" />
                    </span>
                  )}

                  {/* Sparkle glints on hover */}
                  <span
                    aria-hidden
                    className="sparkle right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={
                      {
                        "--sparkle-size": "12px",
                        "--twinkle-delay": "0.1s",
                      } as React.CSSProperties
                    }
                  />
                  <span
                    aria-hidden
                    className="sparkle right-9 top-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={
                      {
                        "--sparkle-size": "8px",
                        "--twinkle-delay": "0.6s",
                        "--sparkle-color": "var(--color-glint-cyan)",
                      } as React.CSSProperties
                    }
                  />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    {item.category && (
                      <span className="mb-1.5 inline-block rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                        {item.category}
                      </span>
                    )}
                    {item.title && (
                      <p className="text-sm font-bold leading-snug text-white">{item.title}</p>
                    )}
                    {item.date && (
                      <p className="mt-0.5 text-[11px] text-white/60">{formatDate(item.date)}</p>
                    )}
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---- Lightbox ---- */}
      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.title || "Gallery item"}
          tabIndex={-1}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/92 p-4 backdrop-blur-sm sm:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:right-6 sm:top-6"
          >
            <X size={20} aria-hidden />
          </button>

          {shown.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:left-6"
              >
                <ChevronLeft size={22} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:right-6"
              >
                <ChevronRight size={22} aria-hidden />
              </button>
            </>
          )}

          <figure className="max-h-full w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-navy-900">
              {active.video ? (
                <video
                  key={active.id}
                  src={active.video}
                  poster={active.image || undefined}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full bg-black object-contain"
                />
              ) : active.image ? (
                <Image
                  key={active.id}
                  src={active.image}
                  alt={active.title || ""}
                  width={1400}
                  height={1000}
                  sizes="(max-width: 1024px) 92vw, 900px"
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : null}
            </div>

            <figcaption className="mt-4 text-center">
              {active.title && (
                <p className="text-base font-bold text-white">{active.title}</p>
              )}
              {active.caption && (
                <p className="mx-auto mt-1.5 max-w-xl text-sm leading-relaxed text-white/65">
                  {active.caption}
                </p>
              )}
              <p className="mt-2 text-xs text-white/40">
                {openIndex! + 1} of {shown.length}
                {active.date && ` · ${formatDate(active.date)}`}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
