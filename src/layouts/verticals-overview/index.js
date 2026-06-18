'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseExploreSection from '@/components/BaseExploreSection';
import BaseProcessSection from '@/components/BaseProcessSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const METALENS_COMPARISON = [
    { left: 'Curved surfaces', right: 'Flat, nano-structured' },
    { left: 'Curvatures larger than wavelength', right: 'Sub-wavelength meta-atoms' },
    {
        left: 'Heat resistance depends on material',
        right: 'High heat resistant, all dielectric materials',
    },
    { left: 'Low design DoF in a single component', right: 'High design DoF in a single layer' },
    { left: 'Refraction bends light', right: 'Diffraction bends light' },
    { left: 'Thickness > 1 mm', right: 'Thickness < 1 µm' },
];

const WHY_CARDS = [
    {
        number: '01',
        icon: '/verticals/shared/ic-sec-1.svg',
        title: 'Vertically integrated',
        description: 'Design, fabrication, assembly and software under one roof.',
    },
    {
        number: '02',
        icon: '/verticals/shared/ic-sec-2.svg',
        title: 'Single supplier',
        description: 'One partner from first prototype to production.',
    },
    {
        number: '03',
        icon: '/verticals/shared/ic-sec-3.svg',
        title: 'Prototype to volume',
        description: 'The same platform scales with you.',
    },
    {
        number: '04',
        icon: '/verticals/shared/ic-sec-4.svg',
        title: 'Metrology backed',
        description: 'Every optic is measured on our own test systems.',
    },
];

const PROCESS_STEPS = [
    {
        number: '01',
        title: 'Design',
        description: 'Define the metalens for your application and target performance.',
    },
    {
        number: '02',
        title: 'Fabrication',
        description: 'Pattern the design onto the wafer and produce the optic in our foundry.',
    },
    {
        number: '03',
        title: 'Testing',
        description: 'Characterise performance from a single coupon to the full wafer.',
    },
    {
        number: '04',
        title: 'Module integration',
        description: 'Align and assemble the optic into a camera module, ready to drop into your device.',
    },
    {
        number: '05',
        title: 'Tuning',
        description: 'Tune and enhance the image pipeline, with AI where it adds value.',
    },
    {
        number: '06',
        title: 'Deployment',
        description: 'Move to volume with the same design, from prototype to production.',
    },
];

const VERTICAL_CARDS = [
    {
        number: '01',
        icon: '/verticals/shared/icon-1.svg',
        title: 'MetaOptics Equipment',
        description: 'Lithography, testing and assembly systems for flat-optics manufacturing.',
        href: '/verticals/equipment/overview',
    },
    {
        number: '02',
        icon: '/verticals/shared/icon-2.svg',
        title: 'MetaOptics Foundry',
        description: 'Custom metalens fabrication from prototyping to volume.',
        href: '/verticals/foundary/overview',
    },
    {
        number: '03',
        icon: '/verticals/shared/icon-3.svg',
        title: 'MetaOptics Products',
        description: 'Metalens-enabled modules and devices ready to integrate.',
        href: '/verticals/product/overview',
    },
    {
        number: '04',
        icon: '/verticals/shared/icon-4.svg',
        title: 'MetaOptics AI',
        description: 'Software and models that turn metalens imagery into intelligence.',
        href: '/verticals/ai/overview',
    },
];

const VerticalsOverview = () => {
    return (
        <>
            <BaseSplitBanner
                title={
                    <>
                        One platform,
                        <br />
                        four verticals
                    </>
                }
                subtitle="From the equipment that patterns flat optics to the AI that reads what they see."
                description="MetaOptics designs, builds and runs the entire metalens stack. Choose the vertical that matches how you want to work with us."
                imageSrc="/verticals/overview/banner.png"
                imageAlt="One platform, four verticals"
                buttonLabel="Request a Demo"
                buttonHref="/contact-us"
            />

            <BaseFeatureSection
                title="What is a metalens"
                description="A metalens is a flat, nano-structured surface that focuses light like a curved lens, in a single layer thinner than a micron."
                imageSrc="/verticals/overview/how-it-works.png"
                imageAlt="What is a metalens"
                imagePosition="left"
                imageBottomMobile
            >
                <div className="mt-[32px] border border-[#D3D0D0]">
                    {/* Header row */}
                    <div className="grid grid-cols-2 bg-[#EAEAEA]">
                        <div className="px-[24px] py-[16px] text-center text-[19px] futura-medium font-medium tracking-[0.02em] text-[#676767]">
                            Traditional Micro-Optics
                        </div>
                        <div className="border-l border-[#D3D0D0] px-[24px] py-[16px] text-center text-[19px] futura-medium font-medium tracking-[0.02em] text-[#D34C39]">
                            MetaOptics Metalens
                        </div>
                    </div>
                    {/* Body rows */}
                    {METALENS_COMPARISON.map((row) => (
                        <div key={row.left} className="grid grid-cols-2 border-t border-[#D3D0D0]">
                            <div className="px-[24px] py-[16px] text-center text-[18px] font-normal text-[#676767]">
                                {row.left}
                            </div>
                            <div className="border-l border-[#D3D0D0] px-[24px] py-[16px] text-center text-[18px] font-normal text-[#D34C39]">
                                {row.right}
                            </div>
                        </div>
                    ))}
                </div>
            </BaseFeatureSection>

            <BaseExploreSection
                label="Our verticals"
                title="Explore the verticals"
                description="Our four verticals are one connected system. Equipment patterns and tests the optics. Foundry fabricates them at volume. Products turn them into ready-to-integrate modules. AI turns their output into usable information."
                items={VERTICAL_CARDS}
            />

            <BaseProcessSection
                label="Our process"
                title="From design to deployment"
                description="Every project moves through the same path. Because we own each step, what we prototype is what we scale."
                imageSrc="/verticals/overview/design-to-deployment.png"
                imageAlt="From design to deployment"
                steps={PROCESS_STEPS}
            />

            <BaseWhySection title="Why MetaOptics" items={WHY_CARDS} />

            <BaseCtaSection
                label="Talk to our team"
                title="Find your vertical"
                description="Tell us what you are building and we will point you to the right vertical."
                imageSrc="/verticals/shared/find.png"
                imageAlt="Find your vertical"
                buttonLabel="Contact us"
                buttonHref="/contact-us"
                backgroundImage="/verticals/shared/contact.png"
                backgroundImageMobile="/verticals/shared/contact-mobile.png"
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default VerticalsOverview;
