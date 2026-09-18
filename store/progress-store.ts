import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Locale } from "@/lib/i18n";
import type { ProgressItem, ProgressItemKind } from "@/lib/progress-types";

interface VisitInput {
  key: string;
  kind: ProgressItemKind;
  locale: Locale;
  title: string;
  href: string;
  /** Total gated exercises. Only ever raised, never lowered — a shorter
   * total on a later render (e.g. a slower client component mounting
   * first) should never erase a bigger known total. */
  totalExercises: number;
}

interface ProgressState {
  items: Record<string, ProgressItem>;

  visitItem: (input: VisitInput) => void;
  completeExercise: (key: string, exerciseId: string) => void;
  resetItem: (key: string) => void;
  resetAll: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      items: {},

      visitItem: ({ key, kind, locale, title, href, totalExercises }) => {
        const existing = get().items[key];
        set((state) => ({
          items: {
            ...state.items,
            [key]: {
              key,
              kind,
              locale,
              title,
              href,
              totalExercises: Math.max(totalExercises, existing?.totalExercises ?? 0),
              completedExerciseIds: existing?.completedExerciseIds ?? [],
              lastAccessedAt: Date.now(),
            },
          },
        }));
      },

      completeExercise: (key, exerciseId) => {
        const existing = get().items[key];
        if (!existing) return; // visitItem must run first so title/href/kind are known
        if (existing.completedExerciseIds.includes(exerciseId)) return; // idempotent
        set((state) => ({
          items: {
            ...state.items,
            [key]: {
              ...existing,
              completedExerciseIds: [...existing.completedExerciseIds, exerciseId],
            },
          },
        }));
      },

      resetItem: (key) => {
        set((state) => {
          const next = { ...state.items };
          delete next[key];
          return { items: next };
        });
      },

      resetAll: () => set({ items: {} }),
    }),
    {
      name: "mathemagic-progress-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/** Most recently visited items first, capped to `limit` (default 8 — the
 * homepage's "last accessed 8 units" requirement). Papers and units are
 * interleaved by recency, not grouped, since both are just "learning items". */
export function selectRecentItems(state: ProgressState, limit = 8): ProgressItem[] {
  return Object.values(state.items)
    .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
    .slice(0, limit);
}

/** Weighted overall percentage across every visited item — weighting by
 * exercise count means a 10-exercise unit properly outweighs a 1-step quiz
 * instead of both counting as "one item" toward the average. */
export function selectOverallPercent(state: ProgressState): number {
  const items = Object.values(state.items);
  const totalExercises = items.reduce((sum, i) => sum + i.totalExercises, 0);
  if (totalExercises === 0) return 0;
  const completed = items.reduce((sum, i) => sum + i.completedExerciseIds.length, 0);
  return Math.round((completed / totalExercises) * 100);
}
