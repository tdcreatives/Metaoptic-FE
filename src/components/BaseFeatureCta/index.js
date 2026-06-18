'use client';

import React from 'react';
import Image from 'next/image';

import ButtonArrow from '@/components/ButtonArrow';

/**
 * Reusable feature section with a call-to-action: a framed image on one side
 * and a heading, paragraph and arrow button on the other. Content is passed
 * via props for reuse.
 *
 * @param {React.ReactNode} title - Heading (pass a node to control line breaks)
 * @param {string} description
 * @param {string} imageSrc
 * @param {string} [imageAlt]
 * @param {number} [imageWidth]
 * @param {number} [imageHeight]
 * @param {'left'|'right'} [imagePosition] - Side the image sits on (default 'right')
 * @param {boolean} [framed] - Show the decorative offset frame behind the image
 * @param {string} [buttonLabel]
 * @param {string} [buttonHref]
 * @param {function} [onButtonClick]
 * @param {string} [background] - Section background color (default '#fff')
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseFeatureCta = ({
    title,
    description,
    imageSrc,
    imageAlt = '',
    imageWidth = 580,
    imageHeight = 435,
    imagePosition = 'right',
    framed = true,
    buttonLabel,
    buttonHref = '#',
    onButtonClick,
    background = '#fff',
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';

    return (
        <section className={className} style={{ backgroundColor: background }}>
            <div
                className={`mx-auto flex w-full max-w-[1660px] flex-col items-center gap-[40px] px-[24px] py-[64px] xl:gap-[86px] xl:px-[72px] xl:py-[96px] ${
                    isImageLeft ? 'xl:flex-row' : 'xl:flex-row-reverse'
                }`}
            >
                {/* Image column */}
                {imageSrc && (
                    <div
                        className={`w-full flex justify-center xl:flex-1 ${
                            isImageLeft ? 'xl:justify-start' : 'xl:justify-end'
                        }`}
                    >
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
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.1] xl:text-[64px]">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-[#4A4A4E] text-[16px] xl:text-[18px] font-normal mt-[20px] leading-relaxed">
                            {description}
                        </p>
                    )}
                    {buttonLabel && (
                        <ButtonArrow
                            label={buttonLabel}
                            href={buttonHref}
                            onClick={onButtonClick}
                            className="mt-[32px]"
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default BaseFeatureCta;
