'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';
import InsideMotviewer from './inside';

const MOTVIEWER_GLANCE = [
    {
        number: '01',
        icon: '/verticals/ai/motviewer/ic-sec-1.svg',
        title: 'Concurrent Multi-Camera',
        description: 'Stream multiple cameras at once, each with its own pipeline and settings.',
    },
    {
        number: '02',
        icon: '/verticals/ai/motviewer/ic-sec-2.svg',
        title: 'Live Processing',
        description: 'High-performance pipeline with zero-copy buffers and parallelised filters.',
    },
    {
        number: '03',
        icon: '/verticals/ai/motviewer/ic-sec-3.svg',
        title: '30+ Filters',
        description:
            'Chainable post-processing: brightness, contrast, edge detection, deconvolution and more.',
    },
    {
        number: '04',
        icon: '/verticals/ai/motviewer/ic-sec-4.svg',
        title: 'AI Enhancement',
        description:
            'Optional plugins for super-resolution, fingerprint and gesture recognition, and enhancement.',
    },
    {
        number: '05',
        icon: '/verticals/ai/motviewer/ic-sec-5.svg',
        title: 'Pipeline Compiler',
        description: 'Export a frozen pipeline as a standalone, deployable DLL.',
    },
    {
        number: '06',
        icon: '/verticals/ai/motviewer/ic-sec-6.svg',
        title: 'SDK Export',
        description: 'Package camera and pipeline as a C/C++ SDK for external applications.',
    },
];

const MOTVIEWER_CAPABILITIES = [
    {
        image: '/verticals/ai/motviewer/product-1.png',
        title: 'Multi-camera streaming',
        description: 'Capture several metalens cameras at once.',
        href: '#',
    },
    {
        image: '/verticals/ai/motviewer/product-2.png',
        title: 'Live processing',
        description: 'See enhanced frames in real time.',
        href: '#',
    },
    {
        image: '/verticals/ai/motviewer/product-3.png',
        title: 'Image alignment and calibration',
        description: 'Line up and calibrate cameras in the app.',
        href: '#',
    },
    {
        image: '/verticals/ai/motviewer/product-4.png',
        title: 'Recognition',
        description: 'Run recognition such as fingerprint and 3D.',
        href: '#',
    },
];

const AiMotviewer = () => {
    return (
        <>
            <BaseSplitBanner
                title="MOTviewer"
                subtitle="The MetaOptics development platform for live image-processing pipelines."
                description="Design, tune and validate imaging pipelines and AI models on MetaOptics camera modules, then package the finished pipeline as a deployable SDK or DLL. One environment from first frame to integration."
                videoSrc="/verticals/ai/motviewer/banner.mp4"
                posterSrc="/verticals/ai/motviewer/banner-poster.jpg"
                buttonLabel="See capabilities"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        Built for
                        <br />
                        metalens imaging
                    </>
                }
                description="MOTviewer captures from one or more metalens cameras, processes frames live, and exports a pipeline you can drop into your own product."
            />

            <InsideMotviewer />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    title="What you can do"
                    items={MOTVIEWER_CAPABILITIES}
                    columns={4}
                    buttonLabel="Learn more"
                    buttonHref="#"
                    background="#F9F9F9"
                />
            </div>

            <BaseWhySection
                title="MOTviewer at a glance"
                items={MOTVIEWER_GLANCE}
                columns={3}
                iconSize={105}
            />

            <BaseCtaSection
                label="Keep in touch"
                title="Talk to our AI team"
                description="Want a closer look at MOTviewer? Tell us about your setup."
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

export default AiMotviewer;
