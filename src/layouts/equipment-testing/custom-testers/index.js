'use client';

import React from 'react';
import Image from 'next/image';

const GALLERY = [
    {
        src: '/verticals/equipment/testing/flat-optics-2.png',
        caption: 'Optical test stage during integration',
    },
    {
        src: '/verticals/equipment/testing/flat-optics-3.png',
        caption: 'Optical bench assembly',
    },
    {
        src: '/verticals/equipment/testing/flat-optics-4.png',
        caption: 'Pick-and-place from wafer to test station and sorting tray',
    },
];

const CustomTesters = () => {
    return (
        <section className="bg-[#F6F5F5]">
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[64px] xl:px-[72px] xl:py-[96px]">
            {/* Heading + copy + main image */}
            <div className="flex flex-col gap-[40px] xl:flex-row xl:gap-[80px]">
                <div className="xl:flex-1">
                    <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.1] xl:text-[64px]">
                        Custom optical testers
                        <br />
                        for flat-optics
                    </h2>
                    <p className="mt-[24px] text-[16px] font-normal text-[#4A4A4E] leading-relaxed max-w-[480px]">
                        Beyond our standard platforms, we develop optical test systems around your
                        production testing needs — tailored to your metasurface, metalens, and
                        flat-optics products. Similar characterisation principles apply across flat
                        optics, so each system can be matched to the wavelengths, geometries, and
                        part handling your process requires.
                    </p>
                    <p className="mt-[24px] text-[16px] font-normal text-[#4A4A4E] leading-relaxed max-w-[480px]">
                        Every system is engineered, assembled, and integrated to industrial
                        standards — covering not just the optics but the full machine build:
                        ergonomic station heights for safe operator access, emergency-stop buttons on
                        each side, guarding free of sharp edges, and a tested enclosure and
                        automation.
                    </p>
                </div>

                <div className="w-full flex justify-center xl:flex-1 xl:justify-end">
                    <Image
                        src="/verticals/equipment/testing/flat-optics-1.png"
                        alt="Custom optical tester for flat-optics"
                        width={591}
                        height={606}
                        className="w-full max-w-[591px] h-auto"
                    />
                </div>
            </div>

            {/* Gallery */}
            <div className="mt-[65px] grid grid-cols-1 gap-[16px] sm:grid-cols-3">
                {GALLERY.map((item) => (
                    <figure key={item.caption}>
                        <Image
                            src={item.src}
                            alt={item.caption}
                            width={404}
                            height={265}
                            className="w-full h-auto"
                        />
                        <figcaption className="bg-[#F4F2EF] px-[16px] py-[14px] text-center text-[14px] text-[#6C6C6C]">
                            {item.caption}
                        </figcaption>
                    </figure>
                ))}
            </div>
            </div>
        </section>
    );
};

export default CustomTesters;
