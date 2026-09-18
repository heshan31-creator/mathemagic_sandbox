import type { MetadataRoute } from "next";
import { getAllUnits } from "@/lib/content";
import { getAllPastPaperParams } from "@/lib/past-papers";
import { siteConfig } from "@/lib/site-config";
import { locales } from "@/lib/i18n";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "grade-10", "grade-11", "past-papers", "about", "contact", "privacy-policy", "terms"];

  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route ? `/${route}` : ""}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1.0 : 0.7,
    }))
  );

  const unitEntries: MetadataRoute.Sitemap = getAllUnits().map((unit) => ({
    url: `${siteConfig.url}/${unit.locale}/${unit.grade}/${unit.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Past papers are structured data registered in lib/past-papers.ts, not
  // MDX scanned by lib/content.ts — sourcing from the same registry the
  // route's generateStaticParams reads guarantees a paper can never go live
  // without appearing here too.
  const pastPaperEntries: MetadataRoute.Sitemap = getAllPastPaperParams().map(({ locale, year }) => ({
    url: `${siteConfig.url}/${locale}/past-papers/${year}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.9,
  }));

  return [...staticEntries, ...unitEntries, ...pastPaperEntries];
}
