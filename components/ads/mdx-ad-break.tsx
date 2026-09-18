import { AdUnit } from "./ad-unit";
import { AD_SLOTS } from "@/lib/ad-config";

/**
 * `<AdBreak/>` is an MDX shortcode an author places manually between logical
 * blocks — e.g. after a unit's intro paragraph, before the interactive
 * sandbox. It is deliberately NOT auto-injected by the MDX pipeline: an
 * automatic "every N paragraphs" rule risks landing an ad between a
 * sandbox's setup instructions and the sandbox itself, or worse, inside a
 * component's own children. Manual placement keeps every ad position under
 * explicit editorial control.
 *
 * Structural guarantee: <StrictExamStepper> never renders MDX children (its
 * content comes entirely from ExamStep data), so there is no code path
 * through which this component could end up inside the exam-stepper's step
 * sequence — the "never inside the quiz" rule holds by construction.
 */
export function AdBreak() {
  return (
    <div className="my-6">
      <AdUnit
        slotId={AD_SLOTS.inContentFluid.slotId}
        format="fluid"
        layoutKey="-6t+ed+2i-1n-4w"
        reservedHeight={AD_SLOTS.inContentFluid.reservedHeight}
      />
    </div>
  );
}
