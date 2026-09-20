"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/ad-config";

export type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal";

export interface AdUnitProps {
  slotId: string;
  format?: AdFormat;
  reservedHeight: number;
  layoutKey?: string; // required by AdSense for format="fluid" native ads
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdUnit({ slotId, format = "auto", reservedHeight, layoutKey, className }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  // Per-instance guard: prevents the same <ins> from being pushed twice
  // (React StrictMode's dev double-invoke, or an unexpected re-render)
  // without relying on a module-level flag, which would incorrectly block
  // a *second, different* AdUnit instance from ever loading.
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!ADSENSE_ENABLED || pushedRef.current || !insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // Script blocked/not yet loaded — the reserved container below still
      // holds its height, so no CLS occurs even on a failed push.
    }
  }, []);

  return (
    <div
      className={`mx-auto flex w-full items-center justify-center bg-gray-50 ${className ?? ""}`}
      style={{ minHeight: reservedHeight }}
      data-ad-slot-id={slotId}
    >
      {ADSENSE_ENABLED ? (
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", minHeight: reservedHeight, width: "100%" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        />
      ) : null}
    </div>
  );
}
