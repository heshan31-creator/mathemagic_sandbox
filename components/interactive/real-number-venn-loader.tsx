"use client";

import dynamic from "next/dynamic";

// Same rationale as interactive-sector-loader.tsx: this component ships its
// own SVG geometry + pointer-drag logic, so it's deferred off pages that
// don't embed it.
export const RealNumberVennLazy = dynamic(
  () => import("./real-number-venn").then((m) => m.RealNumberVenn),
  {
    ssr: false,
    loading: () => <VennSkeleton />,
  }
);

/** Height matched to the real component's typical rendered height
 * (400x400 viewBox SVG at max-w-md + tray + footer row + padding). */
function VennSkeleton() {
  return (
    <div
      style={{ minHeight: 460 }}
      className="animate-pulse rounded-2xl border border-[#dce8dc] bg-[#f7faf6]"
      aria-hidden="true"
    />
  );
}
