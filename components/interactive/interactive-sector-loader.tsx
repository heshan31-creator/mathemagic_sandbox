"use client";

import dynamic from "next/dynamic";

// Mafs pulls in a real SVG math-rendering engine — deferring it off the
// initial bundle keeps grade-10 unit pages that don't need geometry light,
// and prevents this from blocking TBT/INP on pages that do.
export const InteractiveSectorLazy = dynamic(
  () => import("./interactive-sector").then((m) => m.InteractiveSector),
  {
    ssr: false,
    loading: () => <CanvasSkeleton />,
  }
);

/** Fixed-height placeholder — height MUST match the real component's rendered
 * height (Mafs height={340} + surrounding padding) or this becomes a CLS source
 * itself the moment the real component swaps in. */
function CanvasSkeleton() {
  return (
    <div
      style={{ minHeight: 340 + 32 }}
      className="animate-pulse rounded-2xl border border-[#dce8dc] bg-[#f7faf6]"
      aria-hidden="true"
    />
  );
}
