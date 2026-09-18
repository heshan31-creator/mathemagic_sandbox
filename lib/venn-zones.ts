export type ZoneId = "natural" | "integer" | "rational" | "irrational" | "real";

interface ZoneDef {
  id: ZoneId;
  label: string;
  center: [number, number];
  radius: number;
  fill: string;
  stroke: string;
}

// All coordinates live in a 400x400 SVG viewBox.
// Nesting: natural ⊂ integer ⊂ rational ⊂ real; irrational ⊂ real, disjoint from rational.
export const ZONES: ZoneDef[] = [
  { id: "real", label: "Real Numbers", center: [200, 200], radius: 190, fill: "#f7faf6", stroke: "#328E6E" },
  { id: "rational", label: "Rational", center: [150, 210], radius: 130, fill: "#e1eebc", stroke: "#67AE6E" },
  { id: "irrational", label: "Irrational", center: [305, 190], radius: 80, fill: "#d7e7d5", stroke: "#245F4B" },
  { id: "integer", label: "Integers", center: [125, 220], radius: 85, fill: "#c9e4b8", stroke: "#328E6E" },
  { id: "natural", label: "Natural", center: [105, 235], radius: 40, fill: "#90C67C", stroke: "#173229" },
];

// Checked innermost-first so a point inside "natural" resolves to "natural",
// not the "integer"/"rational"/"real" zones that also geometrically contain it.
const ZONE_SPECIFICITY_ORDER: ZoneId[] = ["natural", "integer", "irrational", "rational", "real"];

function distance(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

export function getZone(id: ZoneId): ZoneDef {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) throw new Error(`Unknown zone: ${id}`);
  return zone;
}

/** Resolves the most specific zone a dropped point lands in, or null if outside all zones. */
export function resolveZone(point: [number, number]): ZoneId | null {
  for (const id of ZONE_SPECIFICITY_ORDER) {
    const zone = getZone(id);
    if (distance(point, zone.center) <= zone.radius) return id;
  }
  return null;
}
