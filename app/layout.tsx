import type { ReactNode } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ADSENSE_CLIENT_ID } from "@/lib/ad-config";
import "./globals.css";

// next/font self-hosts + preloads, so there's no external font-request
// waterfall and no FOIT/FOUT reflow — this is the CLS fix for Latin text.
// NOTE: Sinhala/Tamil body copy needs Noto Sans Sinhala / Noto Sans Tamil
// loaded the same way and applied per-locale — not yet wired in, flagged
// in README.md.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}

        {/* afterInteractive: loader script runs once the page is interactive,
            so it never contends with hydration for main-thread time (TBT/INP)
            and never blocks paint (LCP). CLS safety comes from AdUnit's
            reserved height, independent of this script's load timing. */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
