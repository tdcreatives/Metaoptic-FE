'use client';

import React from 'react';

const AiIntelligence = () => {
    return (
        <section className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
            <div className="flex flex-col gap-[40px] xl:flex-row xl:gap-[80px]">
                {/* Heading */}
                <h2 className="futura-condensed-medium font-medium uppercase text-[40px] leading-[1.05] xl:text-[64px] xl:flex-1">
                    <span className="text-[#0B0B0C]">
                        Metalens capture
                        <br />
                        the light.
                    </span>
                    <br />
                    <span className="text-[#d34c39]">Our AI makes sense of it.</span>
                </h2>

                {/* Copy */}
                <div className="xl:flex-1">
                    <p className="text-[22px] futura-medium font-medium text-[#0B0B0C] leading-relaxed">
                        MetaOptics AI combines the precision of metalens technology with
                        proprietary artificial intelligence, delivering software and hardware
                        systems that see, recognise, and enhance.
                    </p>
                    <p className="mt-[24px] text-[16px] futura-medium font-medium text-[#4A4A4E] leading-relaxed">
                        MetaOptics is not just a hardware company. Our proprietary AI layer — built
                        with our AI and machine-learning partners — sits directly on top of our
                        optical systems, transforming raw image data into actionable intelligence.
                        From identifying a fingerprint to sharpening a low-resolution frame in real
                        time, MetaOptics AI extends what our metalens products can do.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AiIntelligence;
