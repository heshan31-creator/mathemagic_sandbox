import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Global canonical-URL hygiene: /unit and /unit/ must not both resolve.
  trailingSlash: false,

  // Treat MDX as a supported Next.js file type. This is also the documented
  // configuration for dynamic MDX imports when using the App Router.
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // Static export target for Cloudflare Pages / Vercel edge hosting.
  output: 'export',

  images: {
    unoptimized: true, // required for static export; use manual <Image> sizing
  },

  // NO redirects()/rewrites()/headers() here — output:'export' is incompatible
  // with those server-side routing features. The bare "/" -> "/si" behavior is
  // implemented by app/page.tsx as a real static page instead.
}

const withMDX = createMDX({
  // Keep the existing YAML frontmatter format used by content/*.mdx while
  // compiling local MDX through Next's native MDX integration.
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'frontmatter' }],
    ],
  },
})

export default withMDX(nextConfig)
