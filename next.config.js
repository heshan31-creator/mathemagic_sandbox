const createMDX = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Global canonical-URL hygiene: /unit and /unit/ must not both resolve.
  trailingSlash: false,

  // Treat MDX as a supported Next.js file type. This is also the documented
  // configuration for dynamic MDX imports when using the App Router.
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // Static export target for Cloudflare Pages / Vercel edge hosting.
  output: "export",

  images: {
    unoptimized: true, // required for static export; use manual <Image> sizing
  },

  // Turbopack needs an explicit loader for statically imported MDX modules.
  turbopack: {
    rules: {
      '*.mdx': {
        loaders: [
          {
            loader: require.resolve('@mdx-js/loader'),
          },
        ],
        as: '*.js',
      },
    },
  },

  // NO redirects()/rewrites()/headers() here — output:"export" is a hard,
  // undocumented-workaround incompatibility with all three (Next's own
  // "Export Custom Routes" error page: these configs simply don't apply to
  // a manually exported app). The bare "/" -> "/si" redirect that used to
  // live here is now handled by a real static page instead: app/page.tsx.

};

const withMDX = createMDX({
  // Keep the existing YAML frontmatter format used by content/*.mdx while
  // compiling local MDX through Next's native MDX integration.
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
});

module.exports = withMDX(nextConfig);
