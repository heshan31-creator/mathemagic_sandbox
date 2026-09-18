import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales, type Locale } from "@/lib/i18n";

interface BuildMetadataArgs {
  locale: Locale;
  path: string;        // e.g. "grade-10/01-perimeter", "" for home
  title: string;
  description: string;
}

/**
 * Central place that emits canonical + alternate-language links.
 * This is the "canonical tag generator" — implemented via Next's
 * native alternates API so it's deduped correctly across nested layouts,
 * rather than a hand-rolled <link> injection.
 */
export function buildMetadata({ locale, path, title, description }: BuildMetadataArgs): Metadata {
  const cleanPath = path ? `/${path}` : "";
  const canonicalUrl = `${siteConfig.url}/${locale}${cleanPath}`;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${siteConfig.url}/${l}${cleanPath}`;
  }

  return {
    title: `${title} | ${siteConfig.name}`,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}
