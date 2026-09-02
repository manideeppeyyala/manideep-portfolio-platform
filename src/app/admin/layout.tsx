/**
 * Admin layout.
 *
 * The login page renders bare (no shell), everything else gets the full
 * CMS chrome. Middleware has already rejected unauthenticated requests
 * before this runs.
 */

import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/helpers";

export const metadata: Metadata = {
  title: "Admin · Portfolio CMS",
  // Belt and braces alongside robots.ts — the admin must never be indexed.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
