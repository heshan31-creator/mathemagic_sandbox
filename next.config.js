/** @type {import('next').NextConfig} */
const nextConfig = {
  // Global canonical-URL hygiene: /unit and /unit/ must not both resolve.
  trailingSlash: false,

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

module.exports = nextConfig;
