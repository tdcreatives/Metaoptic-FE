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
        source: '/company-announcement',
        destination: '/investor-relations/company-announcement',
        permanent: true,
      },
      {
        source: '/company-announcement/:slug',
        destination: '/investor-relations/company-announcement/:slug',
        permanent: true,
      },
      {
        source: '/analyst-coverage',
        destination: '/investor-relations/analyst-coverage',
        permanent: true,
      },
      {
        source: '/investor-relations/stock-info/analyst-coverage',
        destination: '/investor-relations/analyst-coverage',
        permanent: true,
      },
      {
        source: '/investor-relations/financials/:path*',
        destination: '/investor-relations/company-announcement',
        permanent: true,
      },
      {
        source: '/investor-relations/news/:path*',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/investor-relations/resources/email-alerts',
        destination: '/investor-relations/resources/investor-faqs',
        permanent: true,
      },
      {
        source: '/investor-relations/stock-info/:path*',
        destination: '/investor-relations',
        permanent: true,
      },
      {
        source: '/annountcement',
        destination: '/investor-relations/company-announcement',
        permanent: true,
      },
      {
        source: '/annountcement/:slug',
        destination: '/investor-relations/company-announcement/:slug',
        permanent: true,
      },
      {
        source: '/verticals/metalens-foundry/iot-metalens-color-camera',
        destination:
          '/verticals/metalens-products/development-kits/iot-metalens-color-camera',
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