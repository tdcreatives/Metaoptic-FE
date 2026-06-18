'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const CONSUMER_GLANCE = [
    {
        number: '01',
        icon: '/verticals/product/consumer-devices/ic-sec-1.svg',
        title: 'Lightweight design',
        description: 'Glass substrate, single optical surface.',
    },
    {
        number: '02',
        icon: '/verticals/product/consumer-devices/ic-sec-2.svg',
        title: 'Visible-band coverage',
        description: 'Optics for camera and display applications.',
    },
    {
        number: '03',
        icon: '/verticals/product/consumer-devices/ic-sec-3.svg',
        title: 'Wafer-level fabrication',
        description: 'Built for consistent, repeatable production.',
    },
    {
        number: '04',
        icon: '/verticals/product/consumer-devices/ic-sec-4.svg',
        title: 'Configurable to your part',
        description: 'Tailored to the target module and sensor.',
    },
];

const CONSUMER_PRODUCTS = [
    {
        image: '/verticals/product/consumer-devices/product-1.png',
        title: 'Metalens AI Glasses',
        description: 'A lightweight wearable built around metalens optics.',
        href: '/verticals/metalens-products/metalens-ai-glasses',
    },
    {
        image: '/verticals/product/consumer-devices/product-2.png',
        title: 'Metalens 5G Smartphone',
        description: 'Mobile imaging with metalens cameras.',
        href: '/verticals/metalens-products/metalens-5g-smartphone',
    },
];

const ProductConsumerDevices = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Consumer
                        <br />
                        Devices
                    </>
                }
                subtitle="Metalens-equipped smartphone cameras and wearable optics."
                description="Flat-optic lenses that fit into form factors where every micron of stack height and milligram of weight matter. From smartphone main cameras to AR-glass display optics."
                videoSrc="/verticals/product/consumer-devices/banner.mp4"
                posterSrc="/verticals/product/consumer-devices/banner-poster.jpg"
                buttonLabel="See products"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title="More in less space"
                description="Metalenses let consumer devices do more in less space. These products show how flat optics shrink the camera and projection path in everyday hardware."
            />

            <BaseFeatureSection
                title="One metalens, no stack."
                description="A single metalens removes the lens stack, so the optic almost vanishes into the device. That frees space for battery, sensors or a slimmer design."
                imageSrc="/verticals/product/consumer-devices/one-metalens.png"
                imageAlt="One metalens, no stack."
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    chip="Prototype, sampling only"
                    title="Products"
                    items={CONSUMER_PRODUCTS}
                    columns={2}
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-products"
                />
            </div>

            <BaseWhySection title="Consumer at a glance" items={CONSUMER_GLANCE} columns={4} />

            <BaseCtaSection
                label="Keep in touch"
                title={
                    <>
                        Talk to our
                        <br />
                        products team
                    </>
                }
                description="Building a consumer device with metalens optics? Tell us about it."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our products team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default ProductConsumerDevices;
