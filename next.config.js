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
  async redirects() {
    return [
      {
        source: '/verticals/metalens-foundry/iot-metalens-color-camera',
        destination:
          '/verticals/metalens-products/development-kits/iot-rectangular-metalens-color-camera',
        permanent: true,
      },
      {
        source: '/verticals/metalens-foundry/color-imaging-meta-lens',
        destination:
          '/',
        permanent: true,
      },
      {
        source: '/verticals/metalens-foundry/ultra-wide-fov-metalens-monochromatic-ir-camera',
        destination:
          '/',
        permanent: true,
      },
      
    ];
  },
};

module.exports = withMDX(nextConfig); 