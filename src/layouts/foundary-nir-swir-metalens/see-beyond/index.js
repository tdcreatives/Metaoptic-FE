'use client';

import React from 'react';
import Image from 'next/image';

const SeeBeyond = () => {
    return (
        <section className="bg-[#F6F5F5]">
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
                {/* Header */}
                <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start xl:justify-between xl:gap-[60px]">
                    <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] xl:flex-1">
                        See beyond the visible
                    </h2>
                    <p className="text-[#4A4A4E] text-[16px] xl:text-[18px] text-left leading-relaxed xl:flex-1">
                        Our infrared metalenses open up depth, low-light and material sensing beyond
                        the visible. A flat optic delivers a wide field of view in a fraction of the
                        height of a conventional IR lens stack.
                    </p>
                </div>

                {/* Comparison image */}
                <figure className="mt-[40px]">
                    <Image
                        src="/verticals/foundary/nir-swir-metalens/visible-1.png"
                        alt="Left: infrared. Right: visible light."
                        width={1245}
                        height={636}
                        className="w-full h-auto"
                    />
                    <figcaption className="mt-[24px] text-center text-[14px] text-[#6C6C6C]">
                        Left: NIR (Near-Infrared). Right: visible light.
                    </figcaption>
                </figure>
            </div>
        </section>
    );
};

export default SeeBeyond;
