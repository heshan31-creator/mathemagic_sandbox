import type { ZoneId } from "./venn-zones";

export const ZONE_HINTS: Record<ZoneId, string> = {
  natural:
    "Natural numbers are the plain counting numbers: 1, 2, 3, ... — no fractions, no negatives, no zero.",
  integer:
    "Integers include the natural numbers, their negatives, and zero — but nothing with a fractional or decimal part.",
  rational:
    "A rational number can always be written as a fraction a/b of two integers — including terminating or repeating decimals.",
  irrational:
    "Irrational numbers can never be written as an exact fraction — their decimal expansion never ends and never repeats. Think about square roots of non-perfect squares.",
  real: "Every number on this diagram is a real number — this is the outer boundary, not a specific classification.",
};
