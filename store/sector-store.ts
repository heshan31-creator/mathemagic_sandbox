import { create } from "zustand";

interface Milestone {
  id: string;
  label: string;         // e.g. "Semicircle (θ = 180°)"
  targetDegrees: number;
  toleranceDegrees: number;
}

interface SectorState {
  angleDegrees: number;          // single source of truth — Mafs only reads/dispatches this
  radius: number;
  attempts: number;
  incorrectAttempts: number;
  hintVisible: boolean;
  milestonesReached: string[];   // ids of milestones already cleared

  setAngle: (degrees: number) => void;
  checkMilestone: (milestone: Milestone) => boolean;
  dismissHint: () => void;
  reset: () => void;
}

const HINT_THRESHOLD = 3;

export const useSectorStore = create<SectorState>((set, get) => ({
  angleDegrees: 60,
  radius: 3,
  attempts: 0,
  incorrectAttempts: 0,
  hintVisible: false,
  milestonesReached: [],

  setAngle: (degrees) => {
    // Normalize into [0, 360) so dragging past a wrap point doesn't corrupt the fraction math.
    const normalized = ((degrees % 360) + 360) % 360;
    set({ angleDegrees: normalized });
  },

  checkMilestone: (milestone) => {
    const { angleDegrees, attempts, incorrectAttempts, milestonesReached } = get();
    const withinTolerance =
      Math.abs(angleDegrees - milestone.targetDegrees) <= milestone.toleranceDegrees;

    if (withinTolerance) {
      set({
        attempts: attempts + 1,
        milestonesReached: milestonesReached.includes(milestone.id)
          ? milestonesReached
          : [...milestonesReached, milestone.id],
        hintVisible: false,
      });
      return true;
    }

    const nextIncorrect = incorrectAttempts + 1;
    set({
      attempts: attempts + 1,
      incorrectAttempts: nextIncorrect,
      hintVisible: nextIncorrect >= HINT_THRESHOLD,
    });
    return false;
  },

  dismissHint: () => set({ hintVisible: false }),

  reset: () =>
    set({
      angleDegrees: 60,
      attempts: 0,
      incorrectAttempts: 0,
      hintVisible: false,
      milestonesReached: [],
    }),
}));
