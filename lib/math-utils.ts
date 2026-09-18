function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export interface ReducedFraction {
  numerator: number;
  denominator: number;
  isReduced: boolean; // false if original still needs simplifying
}

/** Reduces θ/360 to lowest terms, rounding θ to the nearest integer degree first. */
export function reduceAngleFraction(angleDegrees: number): ReducedFraction {
  const n = Math.round(angleDegrees);
  const d = 360;
  if (n === 0) return { numerator: 0, denominator: 1, isReduced: true };

  const divisor = gcd(n, d);
  return {
    numerator: n / divisor,
    denominator: d / divisor,
    isReduced: divisor === 1,
  };
}
