import type { ComponentType } from "react";

import SiGrade10Perimeter from "@/content/si/grade-10/01-perimeter.mdx";
import SiGrade11RealNumbers from "@/content/si/grade-11/01-real-numbers.mdx";

export type MDXModule = ComponentType;

type MDXRegistry = Record<string, Record<string, Record<string, MDXModule>>>;

/**
 * Keep every MDX module in the static Turbopack module graph.
 *
 * The route pages still discover available units from lib/content.ts, but the
 * actual MDX components are imported statically here. This avoids creating a
 * runtime import context from user-controlled locale/slug values.
 */
export const mdxRegistry: MDXRegistry = {
  si: {
    "grade-10": {
      "01-perimeter": SiGrade10Perimeter,
    },
    "grade-11": {
      "01-real-numbers": SiGrade11RealNumbers,
    },
  },
  ta: {
    "grade-10": {},
    "grade-11": {},
  },
};

export function getMDXModule(
  locale: string,
  grade: "grade-10" | "grade-11",
  slug: string,
): MDXModule | undefined {
  return mdxRegistry[locale]?.[grade]?.[slug];
}
