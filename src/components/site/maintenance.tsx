/**
 * Maintenance screen.
 *
 * Shown to the public when Admin → Website Settings → Maintenance Mode is on.
 * The admin routes stay reachable so the site can be turned back on.
 */

import { Wrench } from "lucide-react";
import type { SiteSettings } from "@/lib/schema";

export function MaintenanceScreen({ settings }: { settings: SiteSettings }) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-hero px-6 text-primary-foreground">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-gold text-accent-foreground shadow-gold">
          <Wrench size={26} aria-hidden />
        </span>

        <h1 className="mt-8 text-3xl font-black tracking-tight sm:text-4xl">
          {settings.shortName}
        </h1>

        <p className="mt-4 leading-relaxed text-primary-foreground/70">
          {settings.maintenanceMessage || "This site is briefly down for updates."}
        </p>

        {settings.email && (
          <a
            href={`mailto:${settings.email}`}
            className="mt-8 inline-block text-sm font-semibold text-accent hover:underline"
          >
            {settings.email}
          </a>
        )}
      </div>
    </main>
  );
}
