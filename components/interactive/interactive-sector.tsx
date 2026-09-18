"use client";

import { Mafs, Coordinates, Circle, Line, MovablePoint, Polygon } from "mafs";
import "mafs/core.css";
import { useMemo, useCallback, useEffect, useRef } from "react";
import { useSectorStore } from "@/store/sector-store";
import { reduceAngleFraction } from "@/lib/math-utils";
import { KatexInline } from "@/components/ui/katex-inline";

const RADIUS = 3;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}
function radToDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

interface InteractiveSectorProps {
  targetDegrees?: number;      // optional milestone, e.g. 180 for "semicircle" units
  targetLabel?: string;
  /** Fired once, the first time the targetDegrees milestone is reached —
   * lets a parent (e.g. ExerciseGate) unlock the next exercise. */
  onComplete?: () => void;
}

export function InteractiveSector({ targetDegrees, targetLabel, onComplete }: InteractiveSectorProps) {
  const angleDegrees = useSectorStore((s) => s.angleDegrees);
  const setAngle = useSectorStore((s) => s.setAngle);
  const checkMilestone = useSectorStore((s) => s.checkMilestone);
  const hintVisible = useSectorStore((s) => s.hintVisible);
  const incorrectAttempts = useSectorStore((s) => s.incorrectAttempts);
  const milestonesReached = useSectorStore((s) => s.milestonesReached);

  const firedRef = useRef(false);
  useEffect(() => {
    if (
      targetDegrees !== undefined &&
      !firedRef.current &&
      milestonesReached.includes(`target-${targetDegrees}`)
    ) {
      firedRef.current = true;
      onComplete?.();
    }
  }, [milestonesReached, targetDegrees, onComplete]);

  const angleRad = degToRad(angleDegrees);
  const sectorPoint: [number, number] = [RADIUS * Math.cos(angleRad), RADIUS * Math.sin(angleRad)];

  // Mafs gives us the dragged point's raw coordinates; we convert back to an
  // angle and push it into Zustand — Mafs never holds angle state itself.
  const handleDrag = useCallback(
    (point: [number, number]) => {
      const rad = Math.atan2(point[1], point[0]);
      setAngle(radToDeg(rad));
    },
    [setAngle]
  );

  const { numerator, denominator } = reduceAngleFraction(angleDegrees);
  const arcLength = (angleDegrees / 360) * 2 * Math.PI * RADIUS;

  const formulaTex = `\\frac{${Math.round(angleDegrees)}}{360} \\times 2\\pi r = \\frac{${numerator}}{${denominator}} \\times 2\\pi r \\approx ${arcLength.toFixed(2)}`;

  const sectorPolygonPoints: [number, number][] = useMemo(
    () => [
      [0, 0],
      sectorPoint,
      // Arc approximation for the fill: sample points between 0 and current angle
      ...Array.from({ length: 24 }, (_, i) => {
        const t = (i / 23) * angleRad;
        return [RADIUS * Math.cos(t), RADIUS * Math.sin(t)] as [number, number];
      }),
    ],
    [angleRad, sectorPoint]
  );

  return (
    <div className="rounded-2xl border border-[#dce8dc] bg-white p-4">
      <Mafs viewBox={{ x: [-4, 4], y: [-4, 4] }} height={340}>
        <Coordinates.Cartesian />
        <Circle center={[0, 0]} radius={RADIUS} color="#dce8dc" />
        <Polygon points={sectorPolygonPoints} color="#328E6E" fillOpacity={0.18} />
        <Line.Segment point1={[0, 0]} point2={sectorPoint} color="#328E6E" />
        <Line.Segment point1={[0, 0]} point2={[RADIUS, 0]} color="#67AE6E" />
        <MovablePoint
          point={sectorPoint}
          color="#245F4B"
          onMove={handleDrag}
        />
      </Mafs>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-lg">
          <KatexInline tex={formulaTex} block />
        </div>
        <div className="text-sm font-semibold text-[#328E6E]">
          θ = {Math.round(angleDegrees)}°
        </div>
      </div>

      {targetDegrees !== undefined && (
        <button
          className="mt-4 rounded-lg bg-[#245F4B] px-4 py-2 font-bold text-white"
          onClick={() =>
            checkMilestone({
              id: `target-${targetDegrees}`,
              label: targetLabel ?? `θ = ${targetDegrees}°`,
              targetDegrees,
              toleranceDegrees: 2,
            })
          }
        >
          Check: reach {targetLabel ?? `${targetDegrees}°`}
        </button>
      )}

      {hintVisible && (
        <div className="mt-3 rounded-lg bg-[#E1EEBC] p-3 text-sm text-[#173229]">
          Hint (attempt {incorrectAttempts}): try lining the point up with the{" "}
          {targetLabel ?? "target angle"} mark — watch how the numerator in the fraction
          above changes as you get closer.
        </div>
      )}
    </div>
  );
}
