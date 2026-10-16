'use client';

import React from 'react';
import Image from 'next/image';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureCta from '@/components/BaseFeatureCta';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';
import SeeBeyond from './see-beyond';

const NIR_SWIR_GLANCE = [
    {
        number: '01',
        icon: '/verticals/foundary/nir-swir-metalens/ic-sec-1.svg',
        title: 'Any field of view',
        description: 'From standard to ultra-wide, including our off-the-shelf wide-FOV IR metalens.',
    },
    {
        number: '02',
        icon: '/verticals/foundary/nir-swir-metalens/ic-sec-2.svg',
        title: 'Any IR band',
        description: 'NIR through SWIR, designed to your wavelength.',
    },
    {
        number: '03',
        icon: '/verticals/foundary/nir-swir-metalens/ic-sec-3.svg',
        title: 'Compact form factor',
        description: 'Thin metasurface optics for space-constrained systems.',
    },
    {
        number: '04',
        icon: '/verticals/foundary/nir-swir-metalens/ic-sec-4.svg',
        title: 'Built to spec',
        description: 'Designed and fabricated to your requirement, not a catalogue.',
    },
    {
        number: '05',
        icon: '/verticals/foundary/nir-swir-metalens/ic-sec-5.svg',
        title: 'Imaging and sensing',
        description: 'For industrial, automotive, security and biomedical use.',
    },
];

const FoundaryNirSwirMetalens = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        NIR and SWIR
                        <br />
                        Metalenses
                    </>
                }
                subtitle="Infrared metalenses, built to your specification."
                description="Our foundry designs and fabricates metalenses across the near-infrared and short-wave infrared bands, matched to your wavelength, field of view and form factor. Ready-made options are available, including a wide field-of-view IR metalens."
                imageSrc="/verticals/foundary/nir-swir-metalens/banner.png"
                imageAlt="NIR and SWIR Metalenses"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See products"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title="Built for NIR and SWIR"
                description="Our metalenses cover the near-infrared (NIR) and short-wave infrared (SWIR) bands. Beyond sensing and imaging, they work as free-space couplers and collimators, for fibre coupling and beam shaping."
            >
                <div className="mt-[44px] grid grid-cols-1 gap-[40px] xl:grid-cols-2">
                    <Image
                        src="/verticals/foundary/nir-swir-metalens/build-1.png"
                        alt="Traditional microlens"
                        width={844}
                        height={1093}
                        className="w-full h-auto"
                    />
                    <Image
                        src="/verticals/foundary/nir-swir-metalens/build-2.png"
                        alt="MetaOptics metalens"
                        width={844}
                        height={1093}
                        className="w-full h-auto"
                    />
                </div>
            </BaseTextSection>

            <SeeBeyond />

            <div id="explore" className="scroll-mt-[40px]">
                <BaseFeatureCta
                    title={
                        <>
                            Ultra-wide FOV IR
                            <br />
                            metalens
                        </>
                    }
                    description="Our wide field-of-view IR metalens is available off the shelf. It is one example of what the foundry can build to your requirements."
                    imageSrc="/verticals/foundary/nir-swir-metalens/ultra-wide.png"
                    imageAlt="Ultra-wide FOV IR metalens"
                    imageWidth={602}
                    imageHeight={457}
                    imagePosition="right"
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-foundry/ultra-wide-fov-ir-metalens"
                    background="#F6F5F5"
                />
            </div>

            <BaseWhySection
                title="NIR and SWIR at a glance"
                items={NIR_SWIR_GLANCE}
                columns={5}
                cardMinHeight={365}
            />

            <BaseCtaSection
                label="Talk to our team"
                title={
                    <>
                        Talk to our
                        <br />
                        foundry team
                    </>
                }
                description="Tell us your wavelength and field-of-view targets."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our foundry team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
                backgroundImageMobile="/verticals/shared/contact-mobile.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default FoundaryNirSwirMetalens;
