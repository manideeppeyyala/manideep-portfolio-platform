import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/utils";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getContent();

  // Admin and API are always disallowed; the public site follows the
  // "Allow search indexing" toggle in Admin → SEO.
  return {
    rules: seo.robotsIndex
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
