const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  output: 'export',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,  // This will generate static image files instead of using /_next/image
  },
};

module.exports = withMDX(nextConfig); 