'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseCtaSection from '@/components/BaseCtaSection';

import SuperResolutionImaging from '@/app/verticals/metaoptics-ai/layouts/SuperResolutionImaging';
import NonContactRecognition from '@/app/verticals/metaoptics-ai/layouts/NonContactRecognition';
import FingerGestureRecognition from '@/app/verticals/metaoptics-ai/layouts/FingerGestureRecognition';
import BrighteningImaging from '@/app/verticals/metaoptics-ai/layouts/BrighteningImaging';
import SharpeningImaging from '@/app/verticals/metaoptics-ai/layouts/SharpeningImaging';
import SummaryTable from '@/app/verticals/metaoptics-ai/layouts/SummaryTable';

const AiModels = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        AI Models &amp;
                        <br />
                        Algorithms
                    </>
                }
                subtitle="Deep-learning models trained on metalens optical data."
                description="A library of neural networks that recover resolution, correct optical aberrations, enhance low-light frames, and recognise fingerprints and gestures, extending what compact metalens cameras can do."
                imageSrc="/verticals/ai/ai-models/banner.png"
                imageAlt="AI Models & Algorithms"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See capabilities"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title="From frames to results"
                description="Our models reconstruct and enhance metalens imagery and pull meaning from it, covering image quality and scene understanding in one toolkit."
            />

            {/* Reused capability sections from the MetaOptics AI page */}
            <div id="explore" className="mx-auto w-full max-w-[1660px] px-[24px] py-[80px] xl:px-[72px] scroll-mt-[40px]">
                <div className="[&>div]:!pt-0">
                    <SuperResolutionImaging />
                </div>
                <NonContactRecognition />
                <FingerGestureRecognition />
                <BrighteningImaging />
                <SharpeningImaging />
                <SummaryTable />
            </div>

            <BaseCtaSection
                label="Keep in touch"
                title="Talk to our AI team"
                description="Want to bring metalens processing into your product? Tell us about it."
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

export default AiModels;
