/**
 * UI primitives.
 *
 * Every visual decision in the product routes through these components, so
 * a change here changes the whole site consistently. Nothing below reads
 * content — they're presentation only.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "outline" | "ghost" | "dark" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-gold hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-current/20 bg-transparent hover:bg-foreground/5 hover:-translate-y-0.5 active:translate-y-0",
  ghost: "bg-transparent hover:bg-foreground/5",
  dark: "bg-primary text-primary-foreground hover:bg-primary-deep hover:-translate-y-0.5 active:translate-y-0",
  danger: "bg-destructive text-destructive-foreground hover:brightness-110",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: string
) {
  return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], extra);
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  ...rest
}: {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = buttonClass(variant, size, className);
  const isExternal = external ?? /^https?:\/\//i.test(href);

  if (isExternal || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Badge / pill                                                        */
/* ------------------------------------------------------------------ */

export function TagPill({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: "gold" | "muted" | "outline";
  className?: string;
}) {
  const tones = {
    gold: "border-gold-300/40 bg-gold-400/10 text-gold-200",
    muted: "border-border bg-muted text-muted-foreground",
    outline: "border-current/25 bg-transparent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ active = true, className }: { active?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        active ? "bg-accent animate-pulse-dot" : "bg-muted-foreground/50",
        className
      )}
    />
  );
}

/** The bordered pill used above hero + as an availability chip. */
export function EyebrowPill({
  children,
  dot = true,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2",
        "text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-200",
        className
      )}
    >
      {dot && <StatusDot />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Section header — the site's core typographic signature              */
/* ------------------------------------------------------------------ */

export function SectionHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** `light` = dark text on light bg; `dark` = light text on navy bg. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em]",
            tone === "dark" ? "text-accent" : "text-primary-glow"
          )}
        >
          <span
            aria-hidden
            className={cn("h-px w-10", tone === "dark" ? "bg-accent" : "bg-primary-glow")}
          />
          {eyebrow}
        </span>
      )}

      <h2
        className={cn(
          "mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl",
          "leading-[1.05]",
          tone === "dark" ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

/** Card for navy sections — glow orb on hover, gold border lift. */
export function DarkCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10",
        "bg-navy-950/90 p-6 shadow-card transition-all duration-300",
        interactive && "hover:-translate-y-2 hover:border-accent/40 hover:shadow-gold",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-20"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

/** Card for light sections. */
export function LightCard({
  children,
  className,
  interactive = true,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card p-6",
        "shadow-card transition-all duration-300",
        interactive && "hover:-translate-y-2 hover:border-primary-glow/40 hover:shadow-lift",
        className
      )}
    >
      {children}
    </div>
  );
}

/** The gold rounded-square icon tile used across cards. */
export function IconTile({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-gradient-gold text-accent-foreground shadow-gold",
        size === "md" ? "h-14 w-14" : "h-10 w-10",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty / loading states                                              */
/* ------------------------------------------------------------------ */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border",
        "bg-muted/40 px-6 py-16 text-center",
        className
      )}
    >
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden />;
}
