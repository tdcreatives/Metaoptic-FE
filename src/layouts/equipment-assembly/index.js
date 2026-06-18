'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BaseFeatureSection from '@/components/BaseFeatureSection';
import BaseFeatureCta from '@/components/BaseFeatureCta';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';

const ASSEMBLY_GLANCE = [
    {
        number: '01',
        icon: '/verticals/equipment/assembly/ic-sec-1.svg',
        title: 'Integrated Test',
        description: 'Optical measurement in the same fixture.',
    },
    {
        number: '02',
        icon: '/verticals/equipment/assembly/ic-sec-2.svg',
        title: 'UV-Cured Bonding',
        description: 'In-cell bonding with no thermal cycle.',
    },
    {
        number: '03',
        icon: '/verticals/equipment/assembly/ic-sec-3.svg',
        title: 'Single Cell',
        description: 'Align, bond and test without re-handling.',
    },
    {
        number: '04',
        icon: '/verticals/equipment/assembly/ic-sec-4.svg',
        title: 'Configurable to your part',
        description: 'Adapts to camera and AR-glass form factors.',
    },
    {
        number: '05',
        icon: '/verticals/equipment/assembly/ic-sec-5.svg',
        title: 'Production and R&D Scale',
        description: 'Suited to pilot lines and volume integration.',
    },
];

const EquipmentAssembly = () => {
    return (
        <>
            <BaseSplitBanner
                title="Assembly"
                subtitle="Automated metalens-to-module alignment, bonding and final test."
                description="Sub-micron 6-axis active alignment, embedded optical test and UV-cured bonding in a single integrated cell. Compatible with smartphone-camera and AR-glass module form factors."
                imageSrc="/verticals/equipment/assembly/banner.png"
                imageAlt="Assembly"
                imageWidth={722}
                imageHeight={560}
                rounded
                buttonLabel="See platforms"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        Optic and sensor,
                        <br />
                        aligned in one pass
                    </>
                }
                description="Metalens modules depend on precise alignment between optic and sensor. Our assembly and test systems handle alignment, bonding and verification in a single automated flow."
            />

            <BaseFeatureSection
                title={
                    <>
                        Assemble and verify
                        <br />
                        together
                    </>
                }
                description="Our assembly machine offers an optional module-testing add-on, so every module is tested automatically right after it is assembled. Build and verification on one system."
                imageSrc="/verticals/equipment/assembly/assemble.png"
                imageAlt="Assemble and verify together"
                imageWidth={580}
                imageHeight={417}
                imagePosition="left"
                framed={false}
            />

            <div id="explore" className="scroll-mt-[40px]">
                <BaseFeatureCta
                    title={
                        <>
                            Automated metalens
                            <br />
                            camera module assembly
                            <br />
                            and test system
                        </>
                    }
                    description="Align, assemble and test camera modules end to end."
                    imageSrc="/verticals/equipment/assembly/automated-metalens.png"
                    imageAlt="Automated metalens camera module assembly and test system"
                    imageWidth={602}
                    imageHeight={457}
                    imagePosition="right"
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-capital-equipment/automated-metalens-camera-module-assembly-and-test-system"
                />
            </div>

            <BaseWhySection
                title="Assembly at a glance"
                items={ASSEMBLY_GLANCE}
                columns={5}
                cardMinHeight={365}
            />

            <BaseCtaSection
                label="Talk to our team"
                title="Talk to our equipment team"
                description="Planning a metalens module line? Tell us about it."
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

export default EquipmentAssembly;
