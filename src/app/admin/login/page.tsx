"use client";

/**
 * Admin sign-in.
 *
 * The password is posted once and verified server-side; nothing about the
 * credential is stored client-side. On success the server sets an httpOnly
 * session cookie and we hand off to the requested page.
 */

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(body.error ?? "Sign-in failed.");
        setPassword("");
        return;
      }

      router.push(next);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-6">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-navy-950/70 p-8 shadow-elegant backdrop-blur-xl">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-accent-foreground shadow-gold">
            <Lock size={20} aria-hidden />
          </span>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-primary-foreground">
            Admin sign-in
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/60">
            Enter your admin password to manage the site.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-primary-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "login-error" : undefined}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/35 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <p
                id="login-error"
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <AlertCircle size={15} aria-hidden className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !password}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-semibold text-accent-foreground shadow-gold transition-all hover:brightness-105 disabled:opacity-50"
            >
              {busy && <Loader2 size={15} aria-hidden className="animate-spin" />}
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-primary-foreground/40">
          Protected area. Attempts are rate limited.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-hero" />}>
      <LoginForm />
    </Suspense>
  );
}
