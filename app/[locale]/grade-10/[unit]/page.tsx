import { notFound } from "next/navigation";
import { getUnit, getUnitsFor } from "@/lib/content";
import { buildMetadata } from "@/components/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { isLocale, type Locale } from "@/lib/i18n";
import { getMDXModule } from "@/lib/mdx-registry";
import { TrackVisit } from "@/components/progress/track-visit";
import { UnitProgressBadge } from "@/components/progress/unit-progress-badge";

interface PageProps {
  params: Promise<{ locale: string; unit: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  // Generates one static path per unit, per locale — this is what keeps the
  // dynamic sitemap and this page's actual output in sync, since both read
  // from the same lib/content.ts scan.
  return getUnitsFor("si", "grade-10")
    .concat(getUnitsFor("ta", "grade-10"))
    .map((u) => ({ locale: u.locale, unit: u.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, unit: unitParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const unit = getUnit(localeParam as Locale, "grade-10", unitParam);
  if (!unit) notFound();

  return buildMetadata({
    locale: unit.locale,
    path: `grade-10/${unit.slug}`,
    title: unit.title,
    description: unit.description,
  });
}

export default async function Grade10UnitPage({ params }: PageProps) {
  const { locale: localeParam, unit: unitParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const unit = getUnit(localeParam as Locale, "grade-10", unitParam);
  if (!unit) notFound();

  const UnitContent = getMDXModule(unit.locale, "grade-10", unit.slug);
  if (!UnitContent) notFound();
  const pageUrl = `${siteConfig.url}/${unit.locale}/grade-10/${unit.slug}`;
  const itemKey = `${unit.locale}/grade-10/${unit.slug}`;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <TrackVisit
        itemKey={itemKey}
        kind="unit"
        locale={unit.locale}
        title={unit.title}
        href={`/${unit.locale}/grade-10/${unit.slug}`}
        totalExercises={unit.exerciseCount}
      />
      {/* h1 is the ONLY h1 on this page — the unit title. Everything inside
          the MDX body (and any embedded exam stepper's heading) nests under it. */}
      <h1 className="mb-3 text-2xl font-black text-[#173229]">{unit.title}</h1>
      <UnitProgressBadge itemKey={itemKey} />
      <JsonLd pageTitle={unit.title} pageDescription={unit.description} pageUrl={pageUrl} />
      <UnitContent />
    </article>
  );
}
