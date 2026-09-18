import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitsFor } from "@/lib/content";
import { buildMetadata } from "@/components/seo/metadata";
import { isLocale, localeStaticParams, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return localeStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return buildMetadata({
    locale: localeParam as Locale,
    path: "grade-10",
    title: "Grade 10",
    description: "All Grade 10 (G.C.E. O/L) units — interactive lessons and practice.",
  });
}

export default async function Grade10IndexPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const units = getUnitsFor(locale, "grade-10");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-black text-[#173229]">Grade 10 — Units</h1>

      {units.length === 0 ? (
        <p className="text-[#61736b]">
          No units published yet for this language. Content is scaffolded across 32 units — check back soon.
        </p>
      ) : (
        <ol className="space-y-2">
          {units.map((unit) => (
            <li key={unit.slug}>
              <Link
                href={`/${locale}/grade-10/${unit.slug}`}
                className="block rounded-lg border border-[#dce8dc] px-4 py-3 font-semibold text-[#245F4B] hover:bg-[#f7faf6]"
              >
                {unit.order}. {unit.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
