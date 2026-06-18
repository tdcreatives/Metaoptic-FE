'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseFeatureCta from '@/components/BaseFeatureCta';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const LITHOGRAPHY_GLANCE = [
    {
        number: '01',
        icon: '/verticals/equipment/lithography/ic-sec-1.svg',
        title: 'Flexible wafer material',
        description: 'Glass, silicon and more, all supported.',
    },
    {
        number: '02',
        icon: '/verticals/equipment/lithography/ic-sec-2.svg',
        title: 'Fast prototyping',
        description: 'Design changes move from CAD to substrate quickly.',
    },
    {
        number: '03',
        icon: '/verticals/equipment/lithography/ic-sec-3.svg',
        title: 'Broad spectral coverage',
        description: 'Visible, NIR and SWIR, all supported.',
    },
    {
        number: '04',
        icon: '/verticals/equipment/lithography/ic-sec-4.svg',
        title: 'Prototype & low-volume',
        description: 'Built for prototyping and small production runs.',
    },
    {
        number: '05',
        icon: '/verticals/equipment/lithography/ic-sec-5.svg',
        title: 'Research & production',
        description: 'Supports both lab iteration and commercial runs.',
    },
];

const EquipmentLithography = () => {
    return (
        <>
            <BaseSplitBanner
                title="Lithography"
                subtitle="Direct-write metalens patterning at sub-100 nm resolution."
                description="Writes metalens geometry directly onto glass substrates, no mask required, for fast iteration and small-volume runs."
                videoSrc="/verticals/equipment/lithography/banner.mp4"
                posterSrc="/verticals/equipment/lithography/banner-poster.jpg"
                buttonLabel="See platforms"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        From design to
                        <br />
                        substrate, fast
                    </>
                }
                description="Our Direct Laser Writer writes metalens patterns straight onto glass, so a design moves from CAD to substrate quickly. Ideal for research, prototyping and small production runs in the visible band."
            />

            <BaseFeatureSection
                title={
                    <>
                        Write any design,
                        <br />
                        no mask
                    </>
                }
                description="Direct-write patterning takes a new metalens design from file to substrate without committing to a mask. You iterate quickly and only scale a design once it is right."
                imageSrc="/verticals/equipment/lithography/write-any-design.png"
                imageAlt="Write any design, no mask"
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BaseFeatureCta
                    title="Direct Laser Writer"
                    description="Maskless direct-write patterning for prototyping and design iteration."
                    imageSrc="/verticals/equipment/lithography/direct-writer.png"
                    imageAlt="Direct Laser Writer"
                    imagePosition="right"
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-capital-equipment/direct-laser-writer"
                />
            </div>

            <BaseWhySection
                title="Lithography at a glance"
                items={LITHOGRAPHY_GLANCE}
                columns={5}
            />

            <BaseCtaSection
                label="Talk to our team"
                title="Talk to our equipment team"
                description="Tell us about the optics you need to pattern."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our equipment team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default EquipmentLithography;
