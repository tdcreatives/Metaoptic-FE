'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseExploreSection from '@/components/BaseExploreSection';
import BaseProcessSection from '@/components/BaseProcessSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';
import AiIntelligence from './intelligence';

const AI_CAPABILITIES = [
    {
        number: '01',
        icon: '/verticals/ai/ic-sec-1.svg',
        title: 'Super-Resolution',
        description: 'Higher resolution from compact metalens sensors, without bigger hardware.',
    },
    {
        number: '02',
        icon: '/verticals/ai/ic-sec-2.svg',
        title: '3D Recognition',
        description: 'Touchless fingerprint recognition at working distance.',
    },
    {
        number: '03',
        icon: '/verticals/ai/ic-sec-3.svg',
        title: 'Gesture Recognition',
        description: 'Real-time touchless interaction for smart glasses and IoT devices.',
    },
    {
        number: '04',
        icon: '/verticals/ai/ic-sec-4.svg',
        title: 'Image Brightening',
        description: 'Intelligent low-light enhancement that preserves detail and suppresses noise.',
    },
    {
        number: '05',
        icon: '/verticals/ai/ic-sec-5.svg',
        title: 'General Enhancement',
        description: 'Correction of metalens optical aberrations.',
    },
];

const AI_PROCESS = [
    {
        number: '01',
        title: 'Capture',
        description: 'Stream frames from one or more metalens cameras.',
    },
    {
        number: '02',
        title: 'Process',
        description: 'Reconstruct and enhance the image in real time.',
    },
    {
        number: '03',
        title: 'Deliver',
        description: 'Output a clear image or a recognised result through the SDK.',
    },
];

const AI_CATEGORIES = [
    {
        number: '01',
        icon: '/verticals/ai/icon-1.svg',
        title: 'MOTviewer',
        description:
            'The development platform for live image-processing pipelines, multi-camera acquisition, a modular filter chain, AI plugins, and one-click pipeline and SDK export.',
        href: '#',
    },
    {
        number: '03',
        icon: '/verticals/ai/icon-2.svg',
        title: 'AI Models & Algorithms',
        description:
            'Deep-learning models trained on metalens optical data, super-resolution, aberration correction, low-light enhancement, and touchless biometric and gesture recognition.',
        href: '#',
    },
];

const AiOverview = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        Optics meets
                        <br />
                        intelligence
                    </>
                }
                subtitle="Metalens capture the light. Our AI makes sense of it."
                description="MetaOptics is not just a hardware company. Our proprietary AI layer, built with our AI and machine-learning partners, sits directly on top of our optical systems."
                imageSrc="/verticals/ai/banner.png"
                imageAlt="Optics meets intelligence"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="Request a Demo"
                buttonHref="/contact-us"
            />

            <BaseFeatureSection
                title="Why metalenses need AI"
                description="Metalens images carry rich information that benefits from processing. Our software and models reconstruct, enhance and interpret that imagery, turning raw frames into clear results."
                imageSrc="/verticals/ai/why.png"
                imageAlt="Why metalenses need AI"
                imageWidth={580}
                imageHeight={435}
                imagePosition="left"
                framed={false}
            />

            <AiIntelligence />

            <BaseExploreSection
                label="Our equipment"
                title="Explore MetaOptics AI"
                items={AI_CATEGORIES}
                columns={2}
            />

            <BaseProcessSection
                label="Our process"
                title="From capture to insight"
                description="One pipeline, from the sensor to a usable result."
                imageSrc="/verticals/overview/design-to-dev.png"
                imageAlt="From capture to insight"
                steps={AI_PROCESS}
            />

            <BaseWhySection
                title="AI capabilities"
                items={AI_CAPABILITIES}
                columns={5}
                iconAlign="center"
            />

            <BaseCtaSection
                label="Keep in touch"
                title="Talk to our AI team"
                description="Want to process metalens imagery in your product? Tell us about it."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Talk to our AI team"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default AiOverview;
