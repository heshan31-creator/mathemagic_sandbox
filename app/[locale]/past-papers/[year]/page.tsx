import { notFound } from "next/navigation";
import { getPastPaper, getAllPastPaperParams } from "@/lib/past-papers";
import { buildMetadata } from "@/components/seo/metadata";
import { JsonLd, QuizJsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import { isLocale, type Locale } from "@/lib/i18n";
import { StrictExamStepperLazy, EXAM_SHELL_MIN_HEIGHT } from "@/components/interactive/strict-exam-stepper-loader";
import { TrackVisit } from "@/components/progress/track-visit";
import { UnitProgressBadge } from "@/components/progress/unit-progress-badge";

interface PageProps {
  params: Promise<{ locale: string; year: string }>;
}

export function generateStaticParams() {
  return getAllPastPaperParams();
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, year: yearParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const paper = getPastPaper(localeParam as Locale, yearParam);
  if (!paper) notFound();

  // Unique per year+locale combination — buildMetadata's path param
  // (past-papers/2023, past-papers/2024, ...) is what keeps canonical
  // and hreflang correct as more years are added.
  return buildMetadata({
    locale: paper.locale,
    path: `past-papers/${paper.year}`,
    title: paper.title,
    description: paper.description,
  });
}

export default async function PastPaperPage({ params }: PageProps) {
  const { locale: localeParam, year: yearParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const paper = getPastPaper(localeParam as Locale, yearParam);
  if (!paper) notFound();

  const pageUrl = `${siteConfig.url}/${paper.locale}/past-papers/${paper.year}`;
  const itemKey = `${paper.locale}/past-papers/${paper.year}`;

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <TrackVisit
        itemKey={itemKey}
        kind="past-paper"
        locale={paper.locale}
        title={paper.title}
        href={`/${paper.locale}/past-papers/${paper.year}`}
        totalExercises={paper.exam.steps.length}
      />
      <h1 className="mb-2 text-2xl font-black text-[#173229]">{paper.title}</h1>
      <p className="mb-3 text-sm text-[#61736b]">{paper.description}</p>
      <UnitProgressBadge itemKey={itemKey} />

      <JsonLd pageTitle={paper.title} pageDescription={paper.description} pageUrl={pageUrl} />
      <QuizJsonLd examTitle={paper.exam.title[paper.locale]} examUrl={pageUrl} stepCount={paper.exam.steps.length} />

      {/* headingLevel=2: this page's only preceding heading is the h1 above,
          so the stepper's step title is correctly an h2 here. progressKey
          ties each step's first-correct-answer to this paper's progress
          entry, so the homepage percentage advances step-by-step. */}
      <div style={{ minHeight: EXAM_SHELL_MIN_HEIGHT }}>
        <StrictExamStepperLazy exam={paper.exam} locale={paper.locale} headingLevel={2} progressKey={itemKey} />
      </div>
    </article>
  );
}
