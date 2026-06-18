'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseExploreSection from '@/components/BaseExploreSection';
import BaseProcessSection from '@/components/BaseProcessSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

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
        title: 'Pattern',
        description: 'Write the design onto the wafer with lithography built for flat optics.',
    },
    {
        number: '04',
        title: 'Fabricate',
        description: 'Produce the optics at volume in our own foundry.',
    },
    {
        number: '05',
        title: 'Integrate',
        description: 'Assemble the optic into a module that is ready to drop into your device.',
    },
    {
        number: '06',
        title: 'Process',
        description: 'Turn what the optic captures into usable information with our AI.',
    },
];

const VERTICAL_CARDS = [
    {
        number: '01',
        icon: '/verticals/shared/icon-1.svg',
        title: 'MetaOptics Equipment',
        description: 'Lithography, testing and assembly systems for flat-optics manufacturing.',
        href: '/verticals/metalens-capital-equipment',
    },
    {
        number: '02',
        icon: '/verticals/shared/icon-2.svg',
        title: 'MetaOptics Foundry',
        description: 'Custom metalens fabrication from prototyping to volume.',
        href: '/verticals/metalens-foundry',
    },
    {
        number: '03',
        icon: '/verticals/shared/icon-3.svg',
        title: 'MetaOptics Products',
        description: 'Metalens-enabled modules and devices ready to integrate.',
        href: '/verticals/metalens-products',
    },
    {
        number: '04',
        icon: '/verticals/shared/icon-4.svg',
        title: 'MetaOptics AI',
        description: 'Software and models that turn metalens imagery into intelligence.',
        href: '/verticals/metaoptics-ai',
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
                title="How a metalens works"
                description="Bringing the optic into the package, rather than mounting it separately, shortens the path between lens and sensor. Alignment holds, the footprint shrinks, and the assembled system behaves as one part."
                imageSrc="/verticals/overview/how-it-works.png"
                imageAlt="How a metalens works"
                imagePosition="left"
            />

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
                imageSrc="/verticals/overview/design-to-dev.png"
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
            />

            {/* Additional sections will be added here as the design is provided */}
        </>
    );
};

export default VerticalsOverview;
