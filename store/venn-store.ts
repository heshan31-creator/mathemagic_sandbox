import { create } from "zustand";
import type { ZoneId } from "@/lib/venn-zones";

interface ItemProgress {
  placedZone: ZoneId | null;
  incorrectAttempts: number;
  hintVisible: boolean;
  solved: boolean;
}

interface VennState {
  items: Record<string, ItemProgress>;

  // Ensures an item has a progress entry before first interaction.
  ensureItem: (id: string) => void;
  attemptPlacement: (id: string, droppedZone: ZoneId | null, correctZone: ZoneId) => boolean;
  dismissHint: (id: string) => void;
  reset: (ids: string[]) => void;
}

const HINT_THRESHOLD = 3;

const emptyProgress = (): ItemProgress => ({
  placedZone: null,
  incorrectAttempts: 0,
  hintVisible: false,
  solved: false,
});

export const useVennStore = create<VennState>((set, get) => ({
  items: {},

  ensureItem: (id) => {
    if (get().items[id]) return;
    set((state) => ({ items: { ...state.items, [id]: emptyProgress() } }));
  },

  attemptPlacement: (id, droppedZone, correctZone) => {
    const current = get().items[id] ?? emptyProgress();
    const isCorrect = droppedZone === correctZone;

    if (isCorrect) {
      set((state) => ({
        items: {
          ...state.items,
          [id]: { ...current, placedZone: droppedZone, solved: true, hintVisible: false },
        },
      }));
      return true;
    }

    const nextIncorrect = current.incorrectAttempts + 1;
    set((state) => ({
      items: {
        ...state.items,
        [id]: {
          ...current,
          placedZone: droppedZone,
          incorrectAttempts: nextIncorrect,
          hintVisible: nextIncorrect >= HINT_THRESHOLD,
          solved: false,
        },
      },
    }));
    return false;
  },

  dismissHint: (id) => {
    const current = get().items[id];
    if (!current) return;
    set((state) => ({ items: { ...state.items, [id]: { ...current, hintVisible: false } } }));
  },

  reset: (ids) => {
    set({ items: Object.fromEntries(ids.map((id) => [id, emptyProgress()])) });
  },
}));

/** Selector helper: is every item in the given set solved? */
export function selectAllSolved(state: VennState, ids: string[]): boolean {
  return ids.every((id) => state.items[id]?.solved);
}
