'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Reusable "process" section: an intro column (eyebrow label, heading,
 * paragraph, image) on the left and a numbered vertical timeline on the right.
 * Content is passed via props so it can be reused across pages.
 *
 * @param {string} label - Small uppercase eyebrow label
 * @param {React.ReactNode} title - Section heading
 * @param {string} description
 * @param {string} [imageSrc]
 * @param {string} [imageAlt]
 * @param {number} [imageWidth]
 * @param {number} [imageHeight]
 * @param {Array<{number: string, title: string, description?: string}>} steps
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseProcessSection = ({
    label,
    title,
    description,
    imageSrc,
    imageAlt = '',
    imageWidth = 508,
    imageHeight = 207,
    steps = [],
    className = '',
}) => {
    return (
        <section
            className={`mx-auto w-full max-w-[1660px] px-[24px] py-[40px] xl:px-[72px] xl:py-[60px] ${className}`}
        >
            <div className="flex flex-col gap-[48px] xl:flex-row xl:gap-[40px]">
                {/* Intro column */}
                <div className="w-full xl:w-[730px]">
                    {label && (
                        <span className="block uppercase text-[12px] tracking-[0.26em] futura-medium font-medium text-[#d34c39]">
                            {label}
                        </span>
                    )}
                    {title && (
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] mt-[16px]">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-[#4A4A4E] text-[17.5px] font-normal mt-[16px] max-w-[460px] leading-relaxed">
                            {description}
                        </p>
                    )}
                    {imageSrc && (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="mt-[48px] w-full max-w-[508px] h-auto rounded-[12px]"
                        />
                    )}
                </div>

                {/* Timeline column */}
                <div className="w-full xl:w-[432px] xl:shrink-0">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        return (
                            <div key={step.number || index} className="flex gap-[24px]">
                                {/* Indicator + connecting line */}
                                <div className="flex flex-col items-center">
                                    <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#d34c39] text-white text-[30px] futura-condensed-medium font-medium">
                                        {step.number}
                                    </div>
                                    {!isLast && (
                                        <div className="w-px flex-1 bg-[#CFCFCF]" />
                                    )}
                                </div>

                                {/* Step content */}
                                <div className={isLast ? '' : 'pb-[40px]'}>
                                    {step.title && (
                                        <h3 className="futura-condensed-medium font-medium text-[30px] leading-[1.1] text-[#0B0B0C]">
                                            {step.title}
                                        </h3>
                                    )}
                                    {step.description && (
                                        <p className="mt-[8px] text-[18px] font-normal text-[#6C6C6C] leading-relaxed">
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BaseProcessSection;
