import { siteConfig } from "@/lib/site-config";

interface JsonLdProps {
  pageTitle: string;
  pageDescription: string;
  pageUrl: string;
  breadcrumb?: { name: string; url: string }[];
}

export function JsonLd({ pageTitle, pageDescription, pageUrl, breadcrumb }: JsonLdProps) {
  const orgId = `${siteConfig.url}/#organization`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": orgId,
        name: siteConfig.org.name,
        url: siteConfig.url,
        logo: siteConfig.org.logo,
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: { "@id": orgId },
        inLanguage: ["si", "ta"],
        ...(breadcrumb
          ? {
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumb.map((b, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  name: b.name,
                  item: b.url,
                })),
              },
            }
          : {}),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface QuizJsonLdProps {
  examTitle: string;
  examUrl: string;
  stepCount: number;
}

/**
 * Quiz schema for a past-paper page. Distinct <script> tag from JsonLd's
 * WebPage/Org graph — Google's structured data testing tool expects Quiz
 * as its own top-level node, not nested inside a WebPage @graph entry.
 */
export function QuizJsonLd({ examTitle, examUrl, stepCount }: QuizJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: examTitle,
    url: examUrl,
    about: { "@type": "Thing", name: "Mathematics" },
    educationalLevel: "Secondary",
    numberOfQuestions: stepCount,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
