'use client';

import React from 'react';
import Image from 'next/image';

import ButtonArrow from '@/components/ButtonArrow';

const PLATFORMS = [
    {
        number: '01',
        image: '/verticals/foundary/platform-1.png',
        title: '4-inch platform',
        description:
            'Fast prototyping at lower volume. Direct Laser Writing, 100 nm critical dimension, 4-inch glass or silicon, non-vacuum.',
    },
    {
        number: '02',
        image: '/verticals/foundary/platform-2.png',
        title: '12-inch platform',
        description:
            'Mass production ready. DUV immersion photolithography, 80 nm critical dimension, 12-inch wafer, semiconductor-grade.',
    },
];

const COMPARISON = [
    { label: 'Purpose', fourIn: 'Prototyping and lower volumes', twelveIn: 'Volume production' },
    { label: 'Path', fourIn: 'Direct-write patterning', twelveIn: 'Immersion lithography' },
    { label: 'Scale', fourIn: 'Single coupon onward', twelveIn: 'Wafer-scale output' },
];

const FoundaryPlatforms = () => {
    return (
        <section className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
            {/* Header */}
            <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start xl:justify-between xl:gap-[60px]">
                <div className="xl:flex-1">
                    <span className="block uppercase text-[12px] font-normal tracking-[0.2em] text-[#d34c39]">
                        Platforms
                    </span>
                    <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] mt-[12px]">
                        Two platforms, one design
                    </h2>
                </div>
                <p className="text-[#4A4A4E] text-[16px] xl:text-[18px] xl:text-right max-w-[460px] leading-relaxed">
                    Start small and scale. The 4-inch platform is built for prototyping and lower
                    volumes, the 12-inch platform for production.
                </p>
            </div>

            {/* Platform cards */}
            <div className="mt-[40px] grid grid-cols-1 gap-[4px] xl:grid-cols-2">
                {PLATFORMS.map((platform) => (
                    <div key={platform.number} className="flex flex-col">
                        <div className="flex items-center justify-center bg-[#E8E5E1] px-[24px] py-[56px]">
                            <Image
                                src={platform.image}
                                alt={platform.title}
                                width={614}
                                height={403}
                                className="w-full max-w-[440px] h-auto"
                            />
                        </div>
                        <div className="bg-[#F4F2EF] p-[24px]">
                            <span className="block text-[11px] font-normal text-[#8A8A8F]">
                                {platform.number}
                            </span>
                            <h3 className="mt-[16px] text-[19px] font-normal text-[#0B0B0C]">
                                {platform.title}
                            </h3>
                            <p className="mt-[8px] text-[15px] font-normal text-[#4A4A4E] leading-relaxed">
                                {platform.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison table */}
            <div className="mt-[40px] overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse border border-[#E5E5E5]">
                    <thead>
                        <tr className="bg-[#F4F2EF]">
                            <th className="w-[20%] px-[24px] py-[16px]" />
                            <th className="px-[24px] py-[16px] text-left text-[12px] futura-medium font-medium uppercase tracking-[2.16px] text-black">
                                4-inch platform
                            </th>
                            <th className="px-[24px] py-[16px] text-left text-[12px] futura-medium font-medium uppercase tracking-[2.16px] text-black">
                                12-inch platform
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {COMPARISON.map((row) => (
                            <tr key={row.label} className="border-t border-[#E5E5E5]">
                                <td className="px-[24px] py-[20px] text-[15.5px] font-normal text-[#0B0B0C]">
                                    {row.label}
                                </td>
                                <td className="px-[24px] py-[20px] text-[15.5px] font-normal text-[#4A4A4E]">
                                    {row.fourIn}
                                </td>
                                <td className="px-[24px] py-[20px] text-[15.5px] font-normal text-[#4A4A4E]">
                                    {row.twelveIn}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CTA */}
            <div className="mt-[40px] flex justify-center">
                <ButtonArrow
                    label="Learn more"
                    href="/verticals/metalens-foundry/4in-12in-platforms"
                />
            </div>
        </section>
    );
};

export default FoundaryPlatforms;
