/**
 * Expertise — deep band, four-column card grid.
 *
 * Mirrors the reference's "research areas" flow: an icon tile, a title, a
 * short description, then a wrapped list of sub-capability tags. Cards
 * lift and warm on hover with a blurred accent orb bleeding in.
 *
 * Backed by the `services` collection, so it's fully CMS-editable:
 * `features` renders as the tag row.
 */

import type { Service } from "@/lib/schema";
import { livePublished } from "@/lib/schema";
import { DarkCard, IconTile, SectionHeader, TagPill } from "@/components/ui";
import { Reveal } from "./motion";
import { ContentIcon } from "./content-icon";

export function ExpertiseSection({ services }: { services: Service[] }) {
  const items = livePublished(services);
  if (!items.length) return null;

  return (
    <section id="expertise" className="bg-deep grid-bg relative isolate overflow-hidden section-y">
      <div className="container-page relative">
        <Reveal>
          <SectionHeader
            tone="dark"
            eyebrow="Expertise"
            title={`${items.length} areas I build in.`}
            description="From backend document pipelines to SQL-driven data engineering and applied AI — the domains where I design, ship and support production systems."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={Math.min(index * 0.05, 0.35)}>
              <DarkCard className="flex h-full flex-col">
                <IconTile>
                  <ContentIcon name={item.icon} size={22} />
                </IconTile>

                <h3 className="mt-5 text-base font-bold leading-snug text-primary-foreground">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-2.5 text-sm leading-relaxed text-primary-foreground/60">
                    {item.description}
                  </p>
                )}

                {item.features.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {item.features.map((feature) => (
                      <li key={feature}>
                        <TagPill>{feature}</TagPill>
                      </li>
                    ))}
                  </ul>
                )}
              </DarkCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
