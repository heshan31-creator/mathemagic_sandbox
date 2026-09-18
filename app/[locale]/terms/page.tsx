import { notFound } from "next/navigation";
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
    path: "terms",
    title: "Terms of Service",
    description: "Terms of use for Mathemagic Sandbox.",
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return (
    <article className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-2xl font-black text-[#173229]">Terms of Service</h1>
      <p className="text-[#61736b]">Placeholder — finalize terms of use before public launch.</p>
    </article>
  );
}
