"use client";

import { AdUnit } from "./ad-unit";
import { AD_SLOTS } from "@/lib/ad-config";
import { Z_INDEX } from "@/lib/z-index";

export const STICKY_ANCHOR_HEIGHT = AD_SLOTS.stickyAnchor.reservedHeight;

export function StickyAnchorAd() {
  return (
    <div
      className="fixed bottom-0 left-0 w-full"
      style={{ zIndex: Z_INDEX.stickyAnchorAd, minHeight: STICKY_ANCHOR_HEIGHT }}
    >
      <AdUnit
        slotId={AD_SLOTS.stickyAnchor.slotId}
        format="auto"
        reservedHeight={STICKY_ANCHOR_HEIGHT}
        className="border-t border-[#dce8dc] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      />
    </div>
  );
}
