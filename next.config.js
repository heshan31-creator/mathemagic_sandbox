/** @type {import('next').NextConfig} */
const nextConfig = {
  // Global canonical-URL hygiene: /unit and /unit/ must not both resolve.
  trailingSlash: false,

  // Static export target for Cloudflare Pages / Vercel edge hosting.
  output: "export",

  images: {
    unoptimized: true, // required for static export; use manual <Image> sizing
  },

  // NO redirects()/rewrites()/headers() here — output:"export" is a hard,
  // undocumented-workaround incompatibility with all three (Next's own
  // "Export Custom Routes" error page: these configs simply don't apply to
  // a manually exported app). The bare "/" -> "/si" redirect that used to
  // live here is now handled by a real static page instead: app/page.tsx.

  // NO @next/mdx / withMDX() wrapping, and NO experimental.mdxRs — removed.
  // @next/mdx exists to let you `import Page from './page.mdx'` directly,
  // which requires pageExtensions + a bundler loader (webpack pre-16,
  // Turbopack-aware in 16+ only on recent @next/mdx versions). This project
  // never does that: every .mdx file is read via fs.readFile and compiled
  // at RUNTIME through next-mdx-remote/rsc's <MDXRemote>, specifically so
  // lib/content.ts can scan frontmatter and drive routing/sitemap/metadata
  // from one source (see Phase 1). @next/mdx was never load-bearing here —
  // it was dead weight that registered a bundler hook, which is exactly
  // what Next 16's "Turbopack + webpack config with no turbopack config"
  // guard rejects. Deleting the dependency (see package.json) is the fix,
  // not adding turbopack.rules for it.
};

module.exports = nextConfig;
