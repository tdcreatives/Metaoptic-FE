const nextConfig = {
    output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
    images: {
        unoptimized: true,
    },
    async redirects() {
        return [
            {
                source: '/verticals/metalens-foundry/iot-metalens-color-camera',
                destination:
                    '/verticals/metalens-products/development-kits/iot-rectangular-metalens-color-camera',
                permanent: true,
            },
        ];
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
    },
};

if (!process.env.NODE_ENV) {
    console.warn('NODE_ENV is not set. Defaulting to standard Next.js behavior.');
}

export default nextConfig;
