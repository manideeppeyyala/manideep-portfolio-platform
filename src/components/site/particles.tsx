"use client";

/**
 * Hero constellation background — cursor-reactive.
 *
 * Three layers of connection:
 *  1. particle ↔ particle  — the ambient constellation
 *  2. particle ↔ cursor    — brighter gold links to whatever is near the
 *                            pointer, so moving the mouse visibly "wires
 *                            up" the field
 *  3. a soft gold halo at the cursor itself
 *
 * Canvas rather than DOM nodes: ~50 particles as elements would mean 50
 * layout-affecting children and a repaint per frame. On canvas it's one
 * element and one draw call per frame.
 *
 * Guardrails that keep it from becoming a battery tax:
 *  - fully skipped when `prefers-reduced-motion` is set
 *  - cursor layer only runs on devices with a real pointer (hover:hover +
 *    pointer:fine), so touch devices don't pay for a feature they can't use
 *  - particle count scales with viewport area, floored on mobile
 *  - pauses via IntersectionObserver once scrolled out of view
 *  - device pixel ratio capped at 2
 *  - pointer listener is passive and attached to the window, so the canvas
 *    can stay `pointer-events: none` and never eat clicks
 */

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

/** particle ↔ particle */
const LINK_DISTANCE = 130;
/** particle ↔ cursor — larger, so the effect is unmistakable */
const CURSOR_DISTANCE = 190;
/** how strongly the cursor tugs nearby particles */
const CURSOR_PULL = 0.035;
const SPEED = 0.16;
const MAX_SPEED = 0.55;

export function Particles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Only wire up cursor interaction where there's a real pointer.
    const pointerCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;

    // Cursor position in canvas-local CSS pixels; null = not over the canvas.
    let mouseX: number | null = null;
    let mouseY: number | null = null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function seed() {
      // ~1 particle per 14k css px², clamped so phones stay cheap.
      const target = Math.round((width * height) / 14000);
      const count = Math.max(18, Math.min(70, target));

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    /**
     * Tracked on window rather than the canvas: the canvas sits behind the
     * hero content with `pointer-events: none`, so it never receives its
     * own mouse events. We convert to canvas-local coordinates and treat
     * "outside the canvas" as no cursor.
     */
    function onPointerMove(event: PointerEvent) {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouseX = null;
        mouseY = null;
        return;
      }
      mouseX = x;
      mouseY = y;
    }

    function onPointerLeave() {
      mouseX = null;
      mouseY = null;
    }

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      // ---- move ----
      for (const p of particles) {
        // Gentle attraction toward the cursor, easing off with distance.
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CURSOR_DISTANCE && dist > 0.5) {
            const force = (1 - dist / CURSOR_DISTANCE) * CURSOR_PULL;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damping + clamp keeps the pull from accelerating particles forever.
        p.vx *= 0.995;
        p.vy *= 0.995;
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — avoids visible "walls".
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      // ---- particle ↔ particle links (drawn first, dots sit on top) ----
      ctx!.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx!.strokeStyle = `rgba(226, 232, 255, ${alpha})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // ---- particle ↔ cursor links (gold, brighter, thicker) ----
      if (mouseX !== null && mouseY !== null) {
        for (const p of particles) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < CURSOR_DISTANCE) {
            const t = 1 - dist / CURSOR_DISTANCE;
            ctx!.strokeStyle = `rgba(250, 204, 92, ${t * 0.55})`;
            ctx!.lineWidth = 0.6 + t * 1.1;
            ctx!.beginPath();
            ctx!.moveTo(mouseX, mouseY);
            ctx!.lineTo(p.x, p.y);
            ctx!.stroke();

            // Brighten the connected dot so the link reads as "active".
            ctx!.fillStyle = `rgba(255, 224, 150, ${0.35 + t * 0.5})`;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, p.r + t * 1.1, 0, Math.PI * 2);
            ctx!.fill();
          }
        }

        // Soft halo at the cursor itself.
        const halo = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 34);
        halo.addColorStop(0, "rgba(250, 204, 92, 0.20)");
        halo.addColorStop(1, "rgba(250, 204, 92, 0)");
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(mouseX, mouseY, 34, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.lineWidth = 1;
      }

      // ---- dots ----
      for (const p of particles) {
        ctx!.fillStyle = "rgba(233, 238, 255, 0.55)";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      frame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    if (pointerCapable) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    // Stop drawing entirely once the hero scrolls away.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          draw();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      if (pointerCapable) {
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerleave", onPointerLeave);
      }
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
