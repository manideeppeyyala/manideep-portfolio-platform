/**
 * Root layout.
 *
 * Metadata, fonts and analytics are all derived from CMS content, so SEO
 * and branding change from the admin panel with no redeploy.
 */

import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import { getContent } from "@/lib/store";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

/* Self-hosted by Next at build time — no render-blocking font request. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, settings } = await getContent();

  const title = seo.defaultTitle || settings.siteTitle;
  const description = seo.defaultDescription || settings.siteDescription;
  const canonical = seo.canonicalUrl || siteUrl();

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: seo.titleTemplate || `%s · ${settings.shortName}`,
    },
    description,
    keywords: seo.keywords,
    authors: [{ name: settings.shortName }],
    creator: settings.shortName,
    alternates: { canonical },
    robots: seo.robotsIndex
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      siteName: settings.shortName,
      title,
      description,
      url: canonical,
      images: seo.ogImage ? [{ url: seo.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: seo.twitterHandle || undefined,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    icons: settings.favicon ? { icon: settings.favicon } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1020",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { seo } = await getContent();

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased">
        {/* Keyboard users land here first. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Skip to content
        </a>

        {children}

        {/* Analytics — configured from Admin → SEO, never hard-coded. */}
        {seo.analyticsProvider === "plausible" && seo.analyticsDomain && (
          <Script
            defer
            data-domain={seo.analyticsDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}

        {seo.analyticsProvider === "umami" && seo.analyticsId && (
          <Script
            defer
            data-website-id={seo.analyticsId}
            src="https://cloud.umami.is/script.js"
            strategy="afterInteractive"
          />
        )}

        {seo.analyticsProvider === "ga4" && seo.analyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${seo.analyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${seo.analyticsId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
