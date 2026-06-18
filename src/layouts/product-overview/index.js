'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseExploreSection from '@/components/BaseExploreSection';
import BaseProcessSection from '@/components/BaseProcessSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const PRODUCT_GLANCE = [
    {
        number: '01',
        icon: '/verticals/product/ic-sec-1.svg',
        title: 'Drop-in integration',
        description: 'Designed to fit existing module footprints.',
    },
    {
        number: '02',
        icon: '/verticals/product/ic-sec-2.svg',
        title: 'Compact form factor',
        description: 'Slim optics for space-constrained devices.',
    },
    {
        number: '03',
        icon: '/verticals/product/ic-sec-3.svg',
        title: 'Configurable to your part',
        description: 'Tailored to your module and use case.',
    },
    {
        number: '04',
        icon: '/verticals/product/ic-sec-4.svg',
        title: 'Kit to volume',
        description: 'Evaluation kits scale to production lines.',
    },
    {
        number: '05',
        icon: '/verticals/product/ic-sec-5.svg',
        title: 'Device-ready optics',
        description: 'Built for end-product applications.',
    },
];

const PRODUCT_PROCESS = [
    {
        number: '01',
        title: 'Evaluate',
        description: 'Prove the optic on a development kit.',
    },
    {
        number: '02',
        title: 'Integrate',
        description: 'Drop the module into your device.',
    },
    {
        number: '03',
        title: 'Scale',
        description: 'Move to volume with the same optic.',
    },
];

const PRODUCT_CATEGORIES = [
    {
        number: '01',
        icon: '/verticals/product/icon-1.svg',
        title: 'Consumer Devices',
        description: 'Metalens-equipped smartphone cameras and wearable optics.',
        href: '/verticals/product/consumer-devices',
    },
    {
        number: '02',
        icon: '/verticals/product/icon-2.svg',
        title: 'Projection Modules',
        description: 'Compact pico-projector optics for portable displays.',
        href: '/verticals/product/projection-modules',
    },
    {
        number: '03',
        icon: '/verticals/product/icon-3.svg',
        title: 'Development Kits',
        description: 'Plug-and-play modules for evaluating metalens performance.',
        href: '/verticals/product/development-kits',
    },
];

const ProductOverview = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        MetaOptics
                        <br />
                        Products
                    </>
                }
                subtitle="Metalens-enabled modules and devices for end-product integration."
                description="Our product portfolio brings metalens advantages directly into customer-facing devices, consumer optics, projection modules and evaluation kits. Each line is designed for drop-in integration."
                videoSrc="/verticals/product/banner.mp4"
                posterSrc="/verticals/product/banner-poster.jpg"
                buttonLabel="Request a Demo"
                buttonHref="/contact-us"
            />

            <BaseFeatureSection
                title="From optic to product"
                description="We turn metalenses into parts you can build with: modules sized for integration, devices that show what metalenses make possible, and kits to evaluate them on your bench."
                imageSrc="/verticals/product/optic-to-product.png"
                imageAlt="From optic to product"
                imagePosition="left"
            />

            <BaseExploreSection
                label="Our equipment"
                title="Categories"
                description="Finished devices, embeddable modules and evaluation kits. Each category is a different way to bring metalens optics into your product."
                items={PRODUCT_CATEGORIES}
                columns={3}
            />

            <BaseProcessSection
                label="Our process"
                title="From kit to product"
                description="Start on the bench, move to your build, then scale."
                imageSrc="/verticals/product/kit-to-product.png"
                imageAlt="From kit to product"
                steps={PRODUCT_PROCESS}
            />

            <BaseWhySection
                title="Products at a glance"
                items={PRODUCT_GLANCE}
                columns={5}
                iconAlign="right"
                iconSize={105}
                cardMinHeight={381}
            />

            <BaseCtaSection
                label="Keep in touch"
                title="Talk to our products team"
                description="Tell us what you are building and we will match a product."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our products team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
                backgroundImageMobile="/verticals/shared/contact-mobile.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default ProductOverview;
