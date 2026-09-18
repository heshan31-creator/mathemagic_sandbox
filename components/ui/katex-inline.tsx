"use client";

import katex from "katex";
import "katex/dist/katex.min.css";
import { useMemo } from "react";

export function KatexInline({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: block }),
    [tex, block]
  );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
