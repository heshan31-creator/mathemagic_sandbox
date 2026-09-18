"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ZONES, resolveZone, type ZoneId } from "@/lib/venn-zones";
import { ZONE_HINTS } from "@/lib/venn-hints";
import { useVennStore, selectAllSolved } from "@/store/venn-store";
import { KatexInline } from "@/components/ui/katex-inline";

export interface VennVariable {
  id: string;
  tex: string;       // KaTeX source, e.g. "\\sqrt{3}", "-5", "\\frac{1}{2}"
  correctZone: ZoneId;
}

const DEFAULT_VARIABLES: VennVariable[] = [
  { id: "sqrt3", tex: "\\sqrt{3}", correctZone: "irrational" },
  { id: "neg5", tex: "-5", correctZone: "integer" },
  { id: "half", tex: "\\frac{1}{2}", correctZone: "rational" },
  { id: "seven", tex: "7", correctZone: "natural" },
  { id: "sqrt2", tex: "\\sqrt{2}", correctZone: "irrational" },
];

const VIEWBOX_SIZE = 400;
const TRAY_ITEM_SIZE = 56;

interface DragChipProps {
  variable: VennVariable;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

function DragChip({ variable, svgRef }: DragChipProps) {
  const progress = useVennStore((s) => s.items[variable.id]);
  const ensureItem = useVennStore((s) => s.ensureItem);
  const attemptPlacement = useVennStore((s) => s.attemptPlacement);
  const dismissHint = useVennStore((s) => s.dismissHint);

  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const chipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureItem(variable.id);
  }, [ensureItem, variable.id]);

  const toSvgPoint = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * VIEWBOX_SIZE;
      const y = ((clientY - rect.top) / rect.height) * VIEWBOX_SIZE;
      return [x, y];
    },
    [svgRef]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (progress?.solved) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragPos) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragPos) return;
    const point = toSvgPoint(e.clientX, e.clientY);
    setDragPos(null);
    if (!point) return;

    const droppedZone = resolveZone(point);
    attemptPlacement(variable.id, droppedZone, variable.correctZone);
  };

  const solved = progress?.solved ?? false;

  return (
    <div className="relative">
      <div
        ref={chipRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={
          dragPos
            ? {
                position: "fixed",
                left: dragPos.x - TRAY_ITEM_SIZE / 2,
                top: dragPos.y - TRAY_ITEM_SIZE / 2,
                zIndex: 50,
              }
            : undefined
        }
        className={`flex items-center justify-center rounded-xl border-2 bg-white shadow-md transition-opacity ${
          solved ? "cursor-default border-[#328E6E] opacity-60" : "cursor-grab border-[#67AE6E] active:cursor-grabbing"
        }`}
        aria-disabled={solved}
      >
        <div style={{ width: TRAY_ITEM_SIZE, height: TRAY_ITEM_SIZE }} className="flex items-center justify-center text-lg font-bold">
          <KatexInline tex={variable.tex} />
        </div>
      </div>

      {progress?.hintVisible && (
        <div className="absolute left-1/2 top-full z-40 mt-2 w-56 -translate-x-1/2 rounded-lg bg-[#E1EEBC] p-3 text-xs text-[#173229] shadow-lg">
          <button
            onClick={() => dismissHint(variable.id)}
            className="float-right text-[#245F4B]"
            aria-label="Dismiss hint"
          >
            ✕
          </button>
          {ZONE_HINTS[variable.correctZone]}
        </div>
      )}
    </div>
  );
}

interface RealNumberVennProps {
  variables?: VennVariable[];
  /** Fired once, the first time every variable is placed in its correct
   * zone — lets a parent (e.g. ExerciseGate) unlock the next exercise. */
  onComplete?: () => void;
}

export function RealNumberVenn({ variables = DEFAULT_VARIABLES, onComplete }: RealNumberVennProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const allSolved = useVennStore((s) => selectAllSolved(s, variables.map((v) => v.id)));
  const reset = useVennStore((s) => s.reset);

  const firedRef = useRef(false);
  useEffect(() => {
    if (allSolved && !firedRef.current) {
      firedRef.current = true;
      onComplete?.();
    }
  }, [allSolved, onComplete]);

  return (
    <div className="rounded-2xl border border-[#dce8dc] bg-white p-4">
      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          className="w-full max-w-md"
          role="img"
          aria-label="Nested Venn diagram of real number classifications"
        >
          {ZONES.map((zone) => (
            <g key={zone.id}>
              <circle
                cx={zone.center[0]}
                cy={zone.center[1]}
                r={zone.radius}
                fill={zone.fill}
                stroke={zone.stroke}
                strokeWidth={2}
                opacity={0.85}
              />
              <text
                x={zone.center[0]}
                y={zone.center[1] - zone.radius + 16}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#173229"
              >
                {zone.label}
              </text>
            </g>
          ))}
        </svg>

        <div className="flex flex-row flex-wrap gap-3 md:flex-col">
          {variables.map((variable) => (
            <DragChip key={variable.id} variable={variable} svgRef={svgRef} />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-[#61736b]">
          {allSolved ? "All numbers correctly classified." : "Drag each number into its zone."}
        </span>
        <button
          onClick={() => reset(variables.map((v) => v.id))}
          className="rounded-lg border border-[#dce8dc] px-3 py-1.5 text-xs font-bold text-[#355047]"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
