"use client";

import dynamic from "next/dynamic";
import type { QuestionStreamProps } from "./question-stream";

/** Reserved height for the stream shell, so the lazy boundary swapping in
 * the real engine never shifts the lesson text above it. Sized for the
 * progress bar + one active card + a few locked shells. */
export const LESSON_STREAM_MIN_HEIGHT = 520;

export const QuestionStreamLazy = dynamic<QuestionStreamProps>(
  () => import("./question-stream").then((m) => m.QuestionStream),
  { ssr: false, loading: () => <StreamSkeleton /> }
);

function StreamSkeleton() {
  return (
    <div
      style={{ minHeight: LESSON_STREAM_MIN_HEIGHT }}
      className="animate-pulse rounded-2xl border border-[#dce8dc] bg-[#f7faf6] motion-reduce:animate-none"
      aria-hidden="true"
    />
  );
}
