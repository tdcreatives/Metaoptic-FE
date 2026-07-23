'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const CAMERA_MODULES_GLANCE = [
    {
        number: '01',
        icon: '/verticals/product/camera-modules/ic-sec-1.svg',
        title: 'Compact',
        description: '12 x 12 x 2.9 mm module',
    },
    {
        number: '02',
        icon: '/verticals/product/camera-modules/ic-sec-2.svg',
        title: 'Single metalens',
        description: 'No lens stack, one flat surface',
    },
    {
        number: '03',
        icon: '/verticals/product/camera-modules/ic-sec-3.svg',
        title: 'Global shutter',
        description: 'Low-distortion capture',
    },
    {
        number: '04',
        icon: '/verticals/product/camera-modules/ic-sec-4.svg',
        title: '70-degree FoV',
        description: 'Visible-band color coverage',
    },
    {
        number: '05',
        icon: '/verticals/product/camera-modules/ic-sec-5.svg',
        title: '2MP and 5MP',
        description: 'Two sensor options',
    },
    {
        number: '06',
        icon: '/verticals/product/camera-modules/ic-sec-6.svg',
        title: 'Tunable assembly',
        description: 'Configurable for your application',
    },
];

const CAMERA_MODULE_PRODUCTS = [
    {
        image: '/verticals/product/camera-modules/product-2MP-RGB-Metalens-FC-Module.png',
        title: '2MP RGB Metalens FC Module',
        description:
            'Single-layer metalens color camera module for color imaging applications.',
        href: '/verticals/metalens-foundry/2mp-rectangular-rgb-metalens-fc-module',
    },
    {
        image: '/verticals/product/camera-modules/product-5MP-Rectangular-RGB-Metalens-FC-Module.png',
        title: '5MP Rectangular RGB Metalens FC Module',
        description:
            'Higher-resolution variant with rectangular metalens for sensing and recognition.',
        href: '/verticals/metalens-foundry/5mp-rectangular-rgb-metalens-fc-module',
    },
];

const ProductCameraModules = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Camera
                        <br />
                        Modules
                    </>
                }
                subtitle="A single metalens surface in a compact, tunable camera module."
                description="Flat optic camera modules built for color imaging and sensing in laptops and mobile phones."
                imageSrc="/verticals/product/camera-modules/banner.png"
                imageAlt="Camera modules"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See products"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                background="#F4F2F0"
                className="border-y border-black/[0.09]"
                title={
                    <>
                        One flat surface
                        <br />
                        replaces the lens stack
                    </>
                }
                description="Each module houses a single metalens patterned at nanoscale on a 12-inch glass wafer, assembled into a 12 x 12 x 2.9 mm package. The assembly process is tunable to fit your application, from color imaging to non-contact fingerprint recognition."
            />

            <BaseFeatureSection
                title={
                    <>
                        Built for sensing
                        <br />
                        and imaging
                    </>
                }
                description="A global shutter CMOS sensor and 70-degree field of view make the modules suited to visible-band color imaging and sensing recognition. Available in 2MP and 5MP to match your resolution requirements."
                imageSrc="/verticals/product/camera-modules/feature-sensing-imaging.png"
                imageAlt="Built for sensing and imaging"
                imagePosition="left"
                framed={false}
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    title="Products"
                    items={CAMERA_MODULE_PRODUCTS}
                    columns={2}
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-products"
                />
            </div>

            <BaseWhySection
                title="Kits at a glance"
                items={CAMERA_MODULES_GLANCE}
                columns={3}
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
                description="Tell us about the camera module integration you need and we will recommend the right configuration."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our products team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
                backgroundImageMobile="/verticals/shared/contact-mobile.png"
            />
        </>
    );
};

export default ProductCameraModules;
