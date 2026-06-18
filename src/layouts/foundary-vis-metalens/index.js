'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const VIS_GLANCE = [
    {
        number: '01',
        icon: '/verticals/foundary/vis-metalens/ic-sec-1.svg',
        title: 'VIS-band coverage',
        description: 'Designed for visible light.',
    },
    {
        number: '02',
        icon: '/verticals/foundary/vis-metalens/ic-sec-2.svg',
        title: 'Polarization insensitive',
        description: 'Consistent across orientations.',
    },
    {
        number: '03',
        icon: '/verticals/foundary/vis-metalens/ic-sec-3.svg',
        title: 'Round or rectangular',
        description: 'Matched to your sensor.',
    },
    {
        number: '04',
        icon: '/verticals/foundary/vis-metalens/ic-sec-4.svg',
        title: 'Compact form factor',
        description: 'Thin, flat optics.',
    },
    {
        number: '05',
        icon: '/verticals/foundary/vis-metalens/ic-sec-5.svg',
        title: 'Configurable to your part',
        description: 'Built to your design.',
    },
    {
        number: '06',
        icon: '/verticals/foundary/vis-metalens/ic-sec-6.svg',
        title: 'Production and R&D scale',
        description: 'Prototype through volume.',
    },
];

const VIS_PRODUCTS = [
    {
        image: '/verticals/foundary/vis-metalens/product-1.png',
        title: 'RGB Metalens',
        description: 'Full-colour imaging in a single flat optic.',
        href: '#',
    },
    {
        image: '/verticals/foundary/vis-metalens/product-2.png',
        title: 'Rectangular RGB Metalens',
        description: 'Colour imaging shaped to rectangular sensors.',
        href: '#',
    },
    {
        image: '/verticals/foundary/vis-metalens/product-3.png',
        title: 'Collimating / Focussing Metalens',
        description: 'Beam shaping for projection and illumination.',
        href: '#',
    },
];

const FoundaryVisMetalens = () => {
    return (
        <>
            <BaseSplitBanner
                title="VIS Metalenses"
                subtitle="RGB-corrected metalenses in round and rectangular form factors."
                description="Sub-wavelength metasurfaces engineered for visible-light imaging. Chromatic correction across the full RGB band, polarization-insensitive, available in round and rectangular die geometries."
                imageSrc="/verticals/foundary/vis-metalens/banner.png"
                imageAlt="VIS Metalenses"
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
                        Built to your form
                        <br />
                        factor
                    </>
                }
                description="Compact, polarization-insensitive metalenses for visible imaging. Round or rectangular, matched to your sensor, and built to your design from prototype through volume."
            />

            <BaseFeatureSection
                title={
                    <>
                        Full colour, one flat
                        <br />
                        surface
                    </>
                }
                description="A single visible-band metalens captures full colour where a conventional camera needs a stack of glass. That removes height and weight from the module and frees space in the device around it."
                imageSrc="/verticals/foundary/vis-metalens/full-color.png"
                imageAlt="Full colour, one flat surface"
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    title="Products"
                    description="Three products cover colour imaging and beam shaping across the visible band."
                    items={VIS_PRODUCTS}
                    columns={3}
                    buttonLabel="Learn more"
                    buttonHref="#"
                />
            </div>

            <BaseWhySection title="VIS at a glance" items={VIS_GLANCE} columns={3} />

            <BaseCtaSection
                label="Talk to our team"
                title={
                    <>
                        Talk to our
                        <br />
                        foundry team
                    </>
                }
                description="Tell us your band, form factor and volume."
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

export default FoundaryVisMetalens;
