# Mathemagic Sandbox

Bilingual (Sinhala / Tamil) interactive mathematics platform for Sri Lankan
G.C.E. Ordinary Level (Grade 10 & 11) students. Next.js App Router, static
export, zero-cost hosting target (Cloudflare Pages / Vercel), client-side-only
progress via Zustand.

Domain: **mmathemagic.com** (see `lib/site-config.ts`).

## Getting started

```bash
npm install
npm run dev
```

This repo has **not** been through `npm install` / a real build in this
environment (no network access to verify) — treat it as an architecturally
complete but build-unverified snapshot. Run the above locally before trusting
it end-to-end.

## What's implemented

- **Bilingual routing** — `app/[locale]/...` for `si` and `ta`, shared
  components, `lib/i18n.ts` as the single locale source of truth.
- **Content pipeline** — `content/<locale>/<grade>/*.mdx`, scanned by
  `lib/content.ts`, driving `generateStaticParams`, `generateMetadata`, and
  `app/sitemap.ts` all from one source, so a new MDX file automatically gets
  a route + canonical/hreflang metadata + a sitemap entry.
- **SEO** — `components/seo/metadata.ts` (canonical + hreflang via the native
  Next Metadata API) and `components/seo/json-ld.tsx`
  (`EducationalOrganization` + `WebPage` graph, plus a `Quiz` schema for
  past-paper pages).
- **Grade 10 module** — `<InteractiveSectorLazy/>`: Mafs-rendered sector with
  a **Zustand-owned angle** (`store/sector-store.ts`) — Mafs is a pure
  controlled component, never holds angle state itself. Live KaTeX fraction
  simplification, milestone-based hints (3-strikes rule).
- **Grade 11 module** — `<RealNumberVennLazy/>`: drag-and-drop nested SVG
  Venn diagram (`lib/venn-zones.ts` resolves innermost-zone-first so nested
  circles classify correctly), per-item Zustand progress + hints
  (`store/venn-store.ts`).
- **O/L exam engine** — `<StrictExamStepperLazy/>` + `store/exam-store.ts`:
  strict per-step grading, **permanent hint-penalty tax** (a hint shown once
  permanently reduces that step's max score, even if answered correctly
  afterward — confirmed grading rule), `lib/answer-validator.ts` using
  `mathjs` for numeric-tolerance validation (e.g. `22/7` and `3.14` both
  validate against the same expected value within an epsilon).
- **Localized exam content** — `ExamStep` fields are `LocalizedString`
  (`{ si, ta }`) objects, not hardcoded English; `lib/exam-types.ts` +
  `content/paper-defs/ol-2023-p2-q4.ts`.
- **AdSense architecture** — CLS-safe `<AdUnit/>` (reserved `min-height`,
  once-only `adsbygoogle.push`), header leaderboard, footer banner,
  `<StickyAnchorAd/>` (fixed, `z-30`), in-content `<AdBreak/>` MDX shortcode.
  The exam stepper structurally cannot render arbitrary MDX/ad content inside
  its step sequence — it consumes typed `ExamStep` data only, never
  `children` — so "no ads inside the quiz" holds by construction, not
  convention.
- **Performance** — heavy client components (`InteractiveSector`,
  `RealNumberVenn`, `StrictExamStepper`) are loaded via `next/dynamic`
  (`ssr: false`) through `*-loader.tsx` wrappers, each with a skeleton whose
  `minHeight` matches the real component to avoid CLS on hydration.
  `next/font` (Inter) for CLS-safe Latin typography.
- **Accessibility** — ARIA labels on all exam-stepper controls, `role="status"`
  / `role="alert"` on hint and validation messages, configurable heading
  level on the stepper so it never breaks the page's h1→h2→h3... hierarchy
  regardless of where it's embedded.

## Open items — read before extending or shipping

### Resolved

1. **`next.config.mjs` redirect vs. static export conflict.** `redirects()`
   is a hard build error under `output: "export"` (Next's own "Export
   Custom Routes" docs — no config-level workaround exists), and
   `middleware.ts` is not an option either (explicitly unsupported under
   static export — no server to run it on). Fixed by removing `redirects()`
   entirely and adding a real `app/page.tsx`: a client component that
   `router.replace()`s to `/si` on mount, with a `<meta http-equiv="refresh">`
   fallback for no-JS clients and crawlers. This page pre-renders to a real
   static `out/index.html`, so it works on any static host.
2. **Native Next MDX pipeline.** Local `content/**/*.mdx` is compiled by
   the official `@next/mdx` integration during the Next build, with
   `remark-frontmatter` + `remark-mdx-frontmatter` preserving the existing
   YAML frontmatter format. Dynamic MDX imports are prerendered from the same
   `lib/content.ts` inventory that drives routes, metadata, and the sitemap.
   This removes the archived `next-mdx-remote` runtime compiler and keeps the
   MDX content inside Next.js/Turbopack's normal build graph.
3. **`package.json` targets current stable Next 16 / React 19.3** and pins the
   Node.js floor required by Next 16. ESLint is invoked directly because the
   `next lint` command was removed in Next 16.

### Still open

4. **`mafs`'s React 19 peer-dependency compatibility hasn't been
   independently verified.** Check its changelog/peerDependencies before
   relying on `<InteractiveSectorLazy/>` in production on Next 16 / React 19.
5. **Sinhala/Tamil translations are machine-assisted, not reviewed.** Every
   locale-keyed string in `content/paper-defs/ol-2023-p2-q4.ts` carries a
   `// TODO: needs native speaker review` comment. Do not ship graded exam
   copy to real students without a native-speaking math educator reviewing
   register and standard textbook phrasing. `grep -r "needs native speaker
   review"` across `content/` before any release to find every instance; a
   CI check on that string was discussed but not implemented.
6. **No Sinhala/Tamil font is wired in yet.** `app/layout.tsx` only loads
   Inter (Latin). Add `Noto Sans Sinhala` / `Noto Sans Tamil` via
   `next/font/google`, applied conditionally per `[locale]` subtree, before
   any real Sinhala/Tamil body copy ships — Inter will not render those
   scripts.
7. **`next/image` optimization is disabled** (`images.unoptimized: true`,
   required for static export). `priority`/`sizes` still control loading
   behavior, but real resizing/format conversion won't happen at request
   time on Cloudflare Pages — pre-generate responsive variants at build time
   or route through Cloudflare Images if LCP on image-heavy pages matters.
8. **`validateAnswer`'s `"algebraic-equivalence"` mode is evaluation-based,
   not symbolic.** It checks "do both sides evaluate to the same number,"
   not "are these the same expression" — fine for the current numeric O/L
   steps, insufficient if a future step needs true symbolic equivalence
   (would need `mathjs`'s `simplify()`/`derivative()` instead).
9. **`EXAM_SHELL_MIN_HEIGHT` (480px) is not a mathematically airtight CLS
   guarantee.** An unusually long translated `prompt`/`hintText` could still
   exceed it. Revisit once real exam copy (post-translation-review) is final
   and measure actual rendered heights.
10. **Real AdSense slot IDs and publisher ID are placeholders**
    (`lib/ad-config.ts`, `.env.example`). Replace `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
    via `.env.local` and the four `slotId` values with real AdSense unit IDs
    before deploying.
11. **Only one past paper (`ol-2023-p2-q4`) and one unit per grade are
    populated.** Scaffolding the remaining Grade 10 (32 units) / Grade 11
    (25 units) MDX stubs and additional past papers was intentionally paused
    at your request — `lib/content.ts` and `lib/past-papers.ts` will pick up
    new entries automatically once added, no other wiring required.
12. **No CI lint rule enforcing the translation-review TODOs** — discussed
    as a next step, not built.
13. **Brand assets** (logo, hero illustration referenced in `next/image`
    usage discussion) are not included — `SiteHeader` currently renders a
    text wordmark as a placeholder.

## Project structure

See inline comments throughout `lib/`, `store/`, and `components/` — most
architectural reasoning (why Zustand owns angle/placement/exam state, why
zone resolution is innermost-first, why the hint penalty is permanent, why
the ad system can't leak into the exam stepper) is documented at the point of
implementation rather than only here.
