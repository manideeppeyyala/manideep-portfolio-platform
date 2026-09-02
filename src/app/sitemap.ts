import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";
import { livePublished } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";

/** Generated from live content, so new projects appear without a code change. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getContent();
  const now = new Date();

  return [
    { url: siteUrl(), lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...livePublished(projects).map((project) => ({
      url: siteUrl(`/projects/${project.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
