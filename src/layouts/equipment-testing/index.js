'use client';

import React from 'react';

import BaseSplitBanner from '@/components/BaseSplitBanner';
import BaseTextSection from '@/components/BaseTextSection';
import BasePlatformsSection from '@/components/BasePlatformsSection';
import BaseWhySection from '@/components/BaseWhySection';
import BaseCtaSection from '@/components/BaseCtaSection';
import CustomTesters from './custom-testers';

const TESTING_GLANCE = [
    {
        number: '01',
        icon: '/verticals/equipment/testing/ic-sec-1.svg',
        title: 'Customisation',
        description: 'Configured to your part, wavelengths and handling.',
    },
    {
        number: '02',
        icon: '/verticals/equipment/testing/ic-sec-2.svg',
        title: 'Repeatability & GR&R',
        description: 'Built for repeatable, gauge-capable measurement.',
    },
    {
        number: '03',
        icon: '/verticals/equipment/testing/ic-sec-3.svg',
        title: 'VIS, NIR, SWIR',
        description: 'Characterised across the visible, near-infrared and short-wave infrared bands.',
    },
    {
        number: '04',
        icon: '/verticals/equipment/testing/ic-sec-4.svg',
        title: 'Coupon to Wafer',
        description: 'One workflow from coupons up to full wafers.',
    },
    {
        number: '05',
        icon: '/verticals/equipment/testing/ic-sec-5.svg',
        title: 'Automation',
        description: 'Manual, semi-automatic or fully automated handling.',
    },
];

const TESTING_PLATFORMS = [
    {
        image: '/verticals/equipment/testing/platform-1.png',
        title: 'Manual Tester',
        description: 'A modular bench for R&D and prototyping.',
        href: '/verticals/metalens-capital-equipment/manual-tester',
    },
    {
        image: '/verticals/equipment/testing/platform-2.png',
        title: 'Automatic Tester',
        description: 'Hands-off characterisation for higher throughput.',
        href: '/verticals/metalens-capital-equipment/metalens-automatic-tester',
    },
    {
        image: '/verticals/equipment/testing/platform-3.png',
        title: 'Wafer-Level Tester',
        description: 'Full-wafer measurement for production.',
        href: '/verticals/metalens-capital-equipment/automated-metalens-camera-module-assembly-and-test-system',
    },
];

const EquipmentTesting = () => {
    return (
        <>
            <BaseSplitBanner
                title="Testing"
                subtitle="Automated metrology for metalens characterization, from coupon to wafer scale."
                description="Closed-loop test stations that measure point-spread function, MTF, throughput and uniformity across visible and infrared bands. Built for production QC and design iteration."
                videoSrc="/verticals/equipment/testing/banner.mp4"
                posterSrc="/verticals/equipment/testing/banner-poster.jpg"
                buttonLabel="See platforms"
                buttonHref="#explore"
                secondaryLabel="See all verticals"
                secondaryHref="/verticals/overview"
            />

            <BaseTextSection
                title={
                    <>
                        From a single coupon
                        <br />
                        to a full wafer
                    </>
                }
                description="Our testers characterise metalenses across visible and infrared bands, from a manual bench for R&D to fully automated wafer-level systems for production, with the repeatability a line needs."
            />

            <CustomTesters />

            <div id="explore" className="scroll-mt-[40px]">
                <BasePlatformsSection
                    title="Platforms"
                    items={TESTING_PLATFORMS}
                    columns={3}
                    buttonLabel="Learn more"
                    buttonHref="/verticals/metalens-capital-equipment"
                />
            </div>

            <BaseWhySection
                title="Testing at a glance"
                items={TESTING_GLANCE}
                columns={5}
                iconAlign="center"
            />

            <BaseCtaSection
                label="Talk to our team"
                title="Talk to our equipment team"
                description="Tell us what you need to measure and we will match a platform."
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

export default EquipmentTesting;
