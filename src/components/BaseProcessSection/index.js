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
        <section className={`bg-[#F6F5F5] ${className}`}>
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[40px] xl:px-[72px] xl:py-[60px]">
                <div className="flex flex-col gap-[48px] xl:flex-row xl:gap-[40px]">
                {/* Intro column */}
                <div className="flex w-full flex-col gap-[32px] xl:w-[730px]">
                    {(label || title) && (
                        <div>
                            {label && (
                                <span className="block uppercase text-[12px] tracking-[0.26em] futura-medium font-medium text-[#d34c39]">
                                    {label}
                                </span>
                            )}
                            {title && (
                                <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] xl:whitespace-nowrap mt-[12px]">
                                    {title}
                                </h2>
                            )}
                        </div>
                    )}
                    {description && (
                        <p className="text-[#4A4A4E] text-[17.5px] font-normal max-w-[460px] leading-relaxed">
                            {description}
                        </p>
                    )}
                    {imageSrc && (
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="w-full max-w-[508px] h-auto rounded-[12px]"
                        />
                    )}
                </div>

                {/* Timeline column - steps distributed evenly to match the intro column height */}
                <div className="relative flex w-full flex-col gap-[40px] pt-[40px] xl:w-[432px] xl:shrink-0 xl:justify-between xl:gap-0">
                    {/* Continuous connecting line through the circle centers */}
                    <div
                        aria-hidden="true"
                        className="absolute left-[28px] top-[96px] bottom-[28px] w-px bg-[#CFCFCF]"
                    />
                    {steps.map((step, index) => (
                        <div
                            key={step.number || index}
                            className="relative flex items-start gap-[24px]"
                        >
                            <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#d34c39] text-white text-[30px] futura-condensed-medium font-medium">
                                {step.number}
                            </div>
                            <div>
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
                    ))}
                </div>
            </div>
        </div>
        </section>
    );
};

export default BaseProcessSection;
