import type { ReactNode } from "react";
import Script from "next/script";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/ad-config";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* afterInteractive: loader script runs once the page is interactive,
            so it never contends with hydration for main-thread time (TBT/INP)
            and never blocks paint (LCP). CLS safety comes from AdUnit's
            reserved height, independent of this script's load timing. */}
        {ADSENSE_ENABLED ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}