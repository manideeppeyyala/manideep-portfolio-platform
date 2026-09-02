"use client";

/**
 * Route error boundary.
 *
 * Shows a human explanation and a retry — never a raw stack trace. The real
 * error still reaches the server logs via Next's own reporting.
 */

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { buttonClass } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route error]", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-6 text-primary-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-black tracking-tight">Something went wrong</h1>
        <p className="mt-4 leading-relaxed text-primary-foreground/65">
          This page hit an unexpected error. Trying again often clears it.
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-primary-foreground/35">
            Reference: {error.digest}
          </p>
        )}

        <button onClick={reset} className={buttonClass("primary", "md", "mt-8")}>
          <RefreshCw size={16} aria-hidden />
          Try again
        </button>
      </div>
    </main>
  );
}
