import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPastPaperParams, getPastPaper } from "@/lib/past-papers";
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
    path: "past-papers",
    title: "O/L Past Papers",
    description: "Digitized Sri Lankan G.C.E. O/L past papers with step-by-step grading.",
  });
}

export default async function PastPapersIndexPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const years = getAllPastPaperParams()
    .filter((p) => p.locale === locale)
    .map((p) => p.year);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-black text-[#173229]">O/L Past Papers</h1>

      <ol className="space-y-2">
        {years.map((year) => {
          const paper = getPastPaper(locale, year);
          if (!paper) return null;
          return (
            <li key={year}>
              <Link
                href={`/${locale}/past-papers/${year}`}
                className="block rounded-lg border border-[#dce8dc] px-4 py-3 font-semibold text-[#245F4B] hover:bg-[#f7faf6]"
              >
                {paper.title}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
