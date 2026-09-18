import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "./i18n";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type Grade = "grade-10" | "grade-11" | "past-papers";
const GRADES: Grade[] = ["grade-10", "grade-11", "past-papers"];

export interface UnitMeta {
  slug: string;
  locale: Locale;
  grade: Grade;
  title: string;
  description: string;
  order: number;
  filePath: string;
  /** Number of sequentially-gated exercises embedded in this unit's MDX
   * (via <ExerciseGate>). Used to seed the progress store's total before
   * any exercise has rendered, and to size the homepage's progress bar
   * without waiting on a client-only computation. Defaults to 1 for units
   * that don't declare it yet (treated as a single ungated activity). */
  exerciseCount: number;
}

/** Walks content/<locale>/<grade>/*.mdx and returns parsed frontmatter. */
export function getAllUnits(): UnitMeta[] {
  const units: UnitMeta[] = [];

  for (const locale of locales) {
    for (const grade of GRADES) {
      const dir = path.join(CONTENT_ROOT, locale, grade);
      if (!fs.existsSync(dir)) continue;

      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".mdx")) continue;
        const filePath = path.join(dir, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);
        const slug = file.replace(/\.mdx$/, "");

        units.push({
          slug,
          locale,
          grade,
          title: data.title ?? slug,
          description: data.description ?? "",
          order: data.order ?? 999,
          filePath,
          exerciseCount: typeof data.exerciseCount === "number" ? data.exerciseCount : 1,
        });
      }
    }
  }

  return units.sort((a, b) => a.order - b.order);
}

export function getUnitsFor(locale: Locale, grade: Grade): UnitMeta[] {
  return getAllUnits().filter((u) => u.locale === locale && u.grade === grade);
}

export function getUnit(locale: Locale, grade: Grade, slug: string): UnitMeta | undefined {
  return getAllUnits().find(
    (u) => u.locale === locale && u.grade === grade && u.slug === slug
  );
}
