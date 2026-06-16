'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Reusable content section: a framed image on one side and a heading +
 * paragraph on the other. The image sits above a decorative offset frame.
 * Content is passed via props so it can be reused across pages.
 *
 * @param {React.ReactNode} title - Heading (pass a node to control line breaks)
 * @param {string} description
 * @param {string} imageSrc
 * @param {string} [imageAlt]
 * @param {number} [imageWidth]
 * @param {number} [imageHeight]
 * @param {'left'|'right'} [imagePosition] - Side the image sits on (default 'left')
 * @param {boolean} [framed] - Show the decorative offset frame behind the image
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseFeatureSection = ({
    title,
    description,
    imageSrc,
    imageAlt = '',
    imageWidth = 582,
    imageHeight = 457,
    imagePosition = 'left',
    framed = true,
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';

    return (
        <section className={`bg-[#F9F9F9] border-y border-black/[0.09] ${className}`}>
            <div
                className={`mx-auto flex w-full max-w-[1660px] flex-col items-center gap-[40px] px-[24px] py-[96px] xl:gap-[80px] xl:px-[72px] ${
                    isImageLeft ? 'xl:flex-row' : 'xl:flex-row-reverse'
                }`}
            >
                {/* Image column */}
                {imageSrc && (
                    <div className="w-full flex justify-center xl:flex-1 xl:justify-start">
                        <div className="relative w-full max-w-[582px]">
                            {framed && (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 translate-x-[20px] translate-y-[20px] rounded-[12px] border border-[#d34c39]/40"
                                />
                            )}
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={imageWidth}
                                height={imageHeight}
                                className="relative z-[1] w-full h-auto"
                            />
                        </div>
                    </div>
                )}

                {/* Text column */}
                <div className="w-full xl:flex-1">
                    {title && (
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[36px] leading-[1.1] xl:text-[64px]">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p className="text-[#4A4A4E] text-[16px] font-normal mt-[20px] max-w-[480px] leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BaseFeatureSection;
