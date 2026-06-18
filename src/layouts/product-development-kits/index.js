'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const KITS_GLANCE = [
    {
        number: '01',
        icon: '/verticals/product/development-kits/ic-sec-1.svg',
        title: 'Software included',
        description: 'Capture and image-analysis tools out of the box.',
    },
    {
        number: '02',
        icon: '/verticals/product/development-kits/ic-sec-2.svg',
        title: 'Visible and IR coverage',
        description: 'Reference designs across imaging and sensing bands.',
    },
    {
        number: '03',
        icon: '/verticals/product/development-kits/ic-sec-3.svg',
        title: 'Bench-top evaluation',
        description: 'Assess performance before module integration.',
    },
    {
        number: '04',
        icon: '/verticals/product/development-kits/ic-sec-4.svg',
        title: 'Research and OEM ready',
        description: 'Suited to lab use and design-in validation.',
    },
    {
        number: '05',
        icon: '/verticals/product/development-kits/ic-sec-5.svg',
        title: 'Application support',
        description: 'Direct line to our optics and software teams.',
    },
];

const DEV_KIT_PRODUCTS = [
    {
        image: '/verticals/product/development-kits/product-1.png',
        title: '3D Biometrics Metalens Sensor',
        description: 'Depth and biometric sensing in a kit.',
        href: '/verticals/metalens-products/development-kits/3d-biometrics-metalens-sensor',
    },
    {
        image: '/verticals/product/development-kits/product-2.png',
        title: 'IoT Metalens Color Camera',
        description: 'A metalens colour camera ready to evaluate.',
        href: '/verticals/metalens-products/development-kits/iot-rectangular-metalens-color-camera',
    },
    {
        image: '/verticals/product/development-kits/product-3.png',
        title: 'Ultra-wide FoV Monochromatic NIR Camera',
        description: 'Wide field-of-view infrared imaging.',
        href: '/verticals/metalens-foundry/ultra-wide-fov-metalens-monochromatic-ir-camera',
    },
];

const ProductDevelopmentKits = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Development
                        <br />
                        Kits
                    </>
                }
                subtitle="Evaluation kits for metalens integration prototyping."
                description="Plug-and-play modules for evaluating metalens performance against your specs before integration into your product. Reference designs span visible imaging, IR sensing and biometric applications."
                imageSrc="/verticals/product/development-kits/banner.png"
                imageAlt="Development Kits"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See products"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        Everything you need
                        <br />
                        to evaluate
                    </>
                }
                description="Each kit pairs a metalens camera or sensor with the software to run it, so you can prove performance and build a proof of concept without a custom setup."
            />

            <BaseFeatureSection
                title="MOTviewer in every kit"
                description="Every kit ships with MOTviewer, our capture and image-analysis application for connecting cameras, running live view and exporting results. No separate integration before you see results."
                videoSrc="/verticals/product/development-kits/kits.mp4"
                posterSrc="/verticals/product/development-kits/kits-poster.jpg"
                frameSrc="/verticals/product/development-kits/border.png"
                imageAlt="MOTviewer in every kit"
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    title="Products"
                    items={DEV_KIT_PRODUCTS}
                    columns={3}
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-products"
                />
            </div>

            <BaseWhySection
                title="Kits at a glance"
                items={KITS_GLANCE}
                columns={5}
                cardMinHeight={348}
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
                description="Tell us what you want to evaluate and we will recommend a kit."
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

export default ProductDevelopmentKits;
