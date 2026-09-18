import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocale, localeStaticParams, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdUnit } from "@/components/ads/ad-unit";
import { StickyAnchorAd, STICKY_ANCHOR_HEIGHT } from "@/components/ads/sticky-anchor-ad";
import { AD_SLOTS } from "@/lib/ad-config";

export function generateStaticParams() {
  return localeStaticParams();
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  return (
    <div data-locale={locale} className="flex min-h-screen flex-col">
      <SiteHeader locale={locale} />

      {/* Directly beneath the nav, above <main> — centered, reserved height,
          so the leaderboard can never push the sandboxes down once it fills. */}
      <div className="w-full py-3">
        <AdUnit
          slotId={AD_SLOTS.headerLeaderboard.slotId}
          format="auto"
          reservedHeight={AD_SLOTS.headerLeaderboard.reservedHeight}
          className="mx-auto max-w-3xl"
        />
      </div>

      {/* paddingBottom exactly matches the fixed anchor ad's height, so the
          end of any page — including the past-paper score dashboard — is
          always fully scrollable past the anchor, never hidden behind it. */}
      <main className="flex-1" style={{ paddingBottom: STICKY_ANCHOR_HEIGHT }}>
        {children}
      </main>

      <AdUnit
        slotId={AD_SLOTS.footerBanner.slotId}
        format="auto"
        reservedHeight={AD_SLOTS.footerBanner.reservedHeight}
        className="mx-auto max-w-3xl"
      />

      <SiteFooter locale={locale} />

      <StickyAnchorAd />
    </div>
  );
}
