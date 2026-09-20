import type { MDXComponents } from 'mdx/types'
import { InteractiveSectorLazy } from '@/components/interactive/interactive-sector-loader'
import { RealNumberVennLazy } from '@/components/interactive/real-number-venn-loader'
import { StrictExamStepperLazy } from '@/components/interactive/strict-exam-stepper-loader'
import { QuestionStreamLazy } from '@/components/lesson/question-stream-loader'
import { KatexInline } from '@/components/ui/katex-inline'
import { AdBreak } from '@/components/ads/mdx-ad-break'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows Next.js to inject standard HTML elements (p, h1, etc.)
    ...components,
    // Maps your custom React components
    InteractiveSectorLazy,
    RealNumberVennLazy,
    StrictExamStepperLazy,
    QuestionStreamLazy,
    KatexInline,
    AdBreak,
  }
}
