import type { ReactNode } from "react";
import Script from "next/script";
import { Inter, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";
import { ADSENSE_CLIENT_ID } from "@/lib/ad-config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const notoSinhala = Noto_Sans_Sinhala({ subsets: ["sinhala"], display: "swap", variable: "--font-noto-sinhala" });
const notoTamil = Noto_Sans_Tamil({ subsets: ["tamil"], display: "swap", variable: "--font-noto-tamil" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSinhala.variable} ${notoTamil.variable}`}>
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