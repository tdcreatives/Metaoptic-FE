'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseFeatureCta from '@/components/BaseFeatureCta';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const PROJECTION_GLANCE = [
    {
        number: '01',
        icon: '/verticals/product/projection-modules/ic-sec-1.svg',
        title: 'Bright output',
        description: 'Throughput-optimised optical path.',
    },
    {
        number: '02',
        icon: '/verticals/product/projection-modules/ic-sec-2.svg',
        title: 'Colour-corrected',
        description: 'Full RGB projection in a single stack.',
    },
    {
        number: '03',
        icon: '/verticals/product/projection-modules/ic-sec-3.svg',
        title: 'Mobile and embedded',
        description: 'Suited to portable and built-in displays.',
    },
    {
        number: '04',
        icon: '/verticals/product/projection-modules/ic-sec-4.svg',
        title: 'Near-eye ready',
        description: 'Configurable for AR and overlay use.',
    },
];

const ProductProjectionModules = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Projection
                        <br />
                        Modules
                    </>
                }
                subtitle="Compact pico-projector optics for portable displays."
                description="Metalens-driven projection modules with high brightness, colour correction and minimal stack height. Designed for portable, mobile and embedded display applications."
                videoSrc="/verticals/product/projection-modules/banner.mp4"
                posterSrc="/verticals/product/projection-modules/banner-poster.jpg"
                buttonLabel="See products"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        A smaller
                        <br />
                        projection path
                    </>
                }
                description="Metalens optics shrink the projection path, so a full projector fits into a far smaller module without giving up output."
            />

            <BaseFeatureSection
                title={
                    <>
                        Collimation in
                        <br />
                        a flat optic
                    </>
                }
                description="A metalens collimates the light source in a single flat surface, removing the bulk of a conventional lens group and shortening the whole module."
                imageSrc="/verticals/product/projection-modules/collimation.png"
                imageAlt="Collimation in a flat optic"
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BaseFeatureCta
                    title={
                        <>
                            Pico Projector
                            <br />
                            (2nd generation)
                        </>
                    }
                    description="Ultra-light projection in a metalens-enabled module."
                    imageSrc="/verticals/product/projection-modules/pico-project.png"
                    imageAlt="Pico Projector (2nd generation)"
                    imageWidth={602}
                    imageHeight={457}
                    imagePosition="right"
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-products/pico-projector-2nd-generation"
                />
            </div>

            <BaseWhySection
                title="Projection at a glance"
                items={PROJECTION_GLANCE}
                columns={4}
                cardMinHeight={312}
            />

            <BaseCtaSection
                label="Keep in touch"
                title={
                    <>
                        Talk to our
                        <br />
                        products team
                    </>
                }
                description="Tell us about the projection module you need."
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

export default ProductProjectionModules;
