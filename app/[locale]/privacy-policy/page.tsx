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
    path: "privacy-policy",
    title: "Privacy Policy",
    description:
      "How Mathemagic Sandbox handles data — client-side progress storage, analytics, and AdSense disclosures.",
  });
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  return (
    <article className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-4 text-2xl font-black text-[#173229]">Privacy Policy</h1>
      <p className="text-[#61736b]">
        Placeholder — progress and hint data are stored client-side only (localStorage/IndexedDB);
        nothing is sent to a server. Details on Google AdSense and analytics cookies go here before launch.
      </p>
    </article>
  );
}
