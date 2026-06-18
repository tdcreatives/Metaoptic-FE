'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseFeatureCta from '@/components/BaseFeatureCta';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const INTEGRATION_GLANCE = [
    {
        number: '01',
        icon: '/verticals/foundary/photonics-integration/ic-sec-1.svg',
        title: 'Lithographic alignment',
        description: 'Fixed positioning defined in fabrication.',
    },
    {
        number: '02',
        icon: '/verticals/foundary/photonics-integration/ic-sec-2.svg',
        title: 'Compact form factor',
        description: 'Module footprint driven by die area.',
    },
    {
        number: '03',
        icon: '/verticals/foundary/photonics-integration/ic-sec-3.svg',
        title: 'Configurable spectral response',
        description: 'Wavelength behaviour designed into the optic.',
    },
    {
        number: '04',
        icon: '/verticals/foundary/photonics-integration/ic-sec-4.svg',
        title: 'Interconnect ready',
        description: 'Suited to dense optical I/O modules.',
    },
    {
        number: '05',
        icon: '/verticals/foundary/photonics-integration/ic-sec-5.svg',
        title: 'Integrated sensing',
        description: 'Compact spectrometer and imaging modules.',
    },
];

const FoundaryPhotonicsIntegration = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Photonics
                        <br />
                        Integration
                    </>
                }
                subtitle="Co-packaged metaoptics for compact photonic systems."
                description="Metalens-enabled co-packaged optical components for data-centre interconnects, quantum-photonics platforms and dense sensing modules. Replace free-space alignment with lithographically defined components."
                imageSrc="/verticals/foundary/photonics-integration/banner.png"
                imageAlt="Photonics Integration"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See services"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        Flat optics for data
                        <br />
                        transfer
                    </>
                }
                description="Flat metaoptics for moving data as light. Light carries information faster and more efficiently, and a flat optic couples and shapes that signal in a single layer."
            />

            <BaseFeatureSection
                title="Alignment made simple"
                description="A flat, patterned metaoptics substrate aligns far more simply than a stack of conventional optics. Fewer elements to register means tighter alignment, a smaller footprint, and a more robust package."
                imageSrc="/verticals/foundary/photonics-integration/alignment.png"
                imageAlt="Alignment made simple"
                imagePosition="left"
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BaseFeatureCta
                    title="Co-packaged optics"
                    description="Metalens and device in one package."
                    imageSrc="/verticals/foundary/photonics-integration/co-packed.png"
                    imageAlt="Co-packaged optics"
                    imageWidth={602}
                    imageHeight={457}
                    imagePosition="right"
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-foundry/co-packaged-optics"
                    background="#F9F9F9"
                />
            </div>

            <BaseWhySection
                title="Integration at a glance"
                items={INTEGRATION_GLANCE}
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
                description="Have a device you want to integrate a metalens with? Tell us about it."
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

export default FoundaryPhotonicsIntegration;
