export const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-XXXXXXXXXXXXXXX";
export const ADSENSE_ENABLED = /^ca-pub-\d{10,}$/.test(ADSENSE_CLIENT_ID);

export const AD_SLOTS = {
  headerLeaderboard: { slotId: "1111111111", reservedHeight: 90 },
  stickyAnchor: { slotId: "2222222222", reservedHeight: 60 },
  inContentFluid: { slotId: "3333333333", reservedHeight: 250 },
  footerBanner: { slotId: "4444444444", reservedHeight: 100 },
} as const;
