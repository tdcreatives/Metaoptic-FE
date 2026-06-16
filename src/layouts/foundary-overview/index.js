'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseExploreSection from '@/components/BaseExploreSection';
import BaseProcessSection from '@/components/BaseProcessSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';
import FoundaryPlatforms from './platforms';

const FOUNDARY_GLANCE = [
    {
        number: '01',
        icon: '/verticals/shared/ic-sec-6.svg',
        title: 'Glass substrate',
        description: 'Fabricated on glass wafers.',
    },
    {
        number: '02',
        icon: '/verticals/shared/ic-sec-7.svg',
        title: '4-inch to 12-inch',
        description: 'One design across scales.',
    },
    {
        number: '03',
        icon: '/verticals/shared/ic-sec-8.svg',
        title: 'Visible and infrared',
        description: 'Coverage across bands.',
    },
    {
        number: '04',
        icon: '/verticals/shared/ic-sec-9.svg',
        title: 'Design support',
        description: 'We help take a concept to a manufacturable part.',
    },
];

const FOUNDARY_PROCESS = [
    {
        number: '01',
        title: 'Design',
        description: 'Start on the 4-inch platform. Direct-write patterning turns your design into a working part, fast.',
    },
    {
        number: '02',
        title: 'Prototype',
        description: 'Move the same design to immersion lithography. No redesign between processes.',
    },
    {
        number: '03',
        title: 'Scale',
        description: 'Run production on the 12-inch platform, with wafer-scale output on glass.',
    },
];

const FOUNDARY_CATEGORIES = [
    {
        number: '01',
        icon: '/verticals/shared/icon-7.svg',
        title: 'VIS Metalenses',
        description: 'Metalenses for the visible band, round or rectangular.',
        href: '#',
    },
    {
        number: '02',
        icon: '/verticals/shared/icon-8.svg',
        title: 'NIR and SWIR Metalenses',
        description: 'Ultra-wide field-of-view metalenses for the NIR and SWIR bands.',
        href: '#',
    },
    {
        number: '03',
        icon: '/verticals/shared/icon-9.svg',
        title: 'Photonics Integration',
        description: 'Co-packaged metaoptics for compact photonic systems.',
        href: '#',
    },
];

const FoundaryOverview = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        MetaOptics
                        <br />
                        Foundry
                    </>
                }
                subtitle="Custom metalens fabrication, built to your requirements."
                description="Whether you need a small batch for early-stage development or high volume production at scale, MetaOptics provides a fabrication platform matched to your needs — from prototype to mass production. Both platforms support glass, silicon, and other materials and are engineered to deliver the nanoscale precision metalens production demands."
                imageSrc="/verticals/foundary/banner.png"
                imageAlt="MetaOptics Foundry"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="Request a Demo"
                buttonHref="/contact-us"
            />

            <BaseFeatureSection
                title={
                    <>
                        Your design,
                        <br />
                        fabricated and scaled
                    </>
                }
                description="Two complementary processes cover the full range. Direct-write patterning for fast prototyping, and immersion lithography for volume. The same design moves from one to the other without a redesign."
                imageSrc="/verticals/foundary/your-design.png"
                imageAlt="Your design, fabricated and scaled"
                imagePosition="left"
            />

            <BaseExploreSection
                label="Our equipment"
                title="Categories"
                description="Metalenses for the visible band, the infrared bands, and integration with photonic and sensor packages."
                items={FOUNDARY_CATEGORIES}
                columns={3}
            />

            <FoundaryPlatforms />

            <BaseProcessSection
                label="Our process"
                title="From prototype to volume"
                description="One design, one supplier, across scales."
                imageSrc="/verticals/overview/design-to-dev.png"
                imageAlt="From prototype to volume"
                steps={FOUNDARY_PROCESS}
            />

            <BaseWhySection
                title="Foundry at a glance"
                items={FOUNDARY_GLANCE}
                columns={4}
                iconAlign="right"
            />

            <BaseCtaSection
                label="Talk to our team"
                title="Talk to our foundry team"
                description="Bring us a design or a target spec and we will scope the run."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our foundry team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default FoundaryOverview;
