"use client";

import { useEffect } from "react";
import { useProgressStore } from "@/store/progress-store";
import type { Locale } from "@/lib/i18n";
import type { ProgressItemKind } from "@/lib/progress-types";

interface TrackVisitProps {
  itemKey: string;
  kind: ProgressItemKind;
  locale: Locale;
  title: string;
  href: string;
  totalExercises: number;
}

/**
 * Drop this once near the top of a unit or past-paper page (both are Server
 * Components) to record "the student opened this" for the homepage's recent
 * list and completion percentage — renders nothing.
 */
export function TrackVisit({ itemKey, kind, locale, title, href, totalExercises }: TrackVisitProps) {
  const visitItem = useProgressStore((s) => s.visitItem);

  useEffect(() => {
    visitItem({ key: itemKey, kind, locale, title, href, totalExercises });
    // Only re-run if the identity of the page or its exercise count changes —
    // NOT on every render, or lastAccessedAt would update on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey, kind, locale, title, href, totalExercises]);

  return null;
}
