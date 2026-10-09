'use client';

import React from 'react';
import Image from 'next/image';

import ButtonArrow from '@/components/ButtonArrow';

/**
 * Reusable call-to-action section: an illustration on one side and an eyebrow
 * label, heading, paragraph and arrow button on the other. The two columns
 * split 50/50 on desktop. Content is passed via props for reuse.
 *
 * @param {string} label - Small uppercase eyebrow label
 * @param {React.ReactNode} title - Section heading
 * @param {string} description
 * @param {string} imageSrc
 * @param {string} [imageAlt]
 * @param {number} [imageWidth]
 * @param {number} [imageHeight]
 * @param {'left'|'right'} [imagePosition] - Side the image sits on (default 'left')
 * @param {string} [buttonLabel]
 * @param {string} [buttonHref]
 * @param {function} [onButtonClick]
 * @param {string} [backgroundImage] - Full-width background image for the section
 * @param {string} [backgroundImageMobile] - Background image used on mobile (falls back to backgroundImage)
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseCtaSection = ({
    label,
    title,
    description,
    imageSrc,
    imageAlt = '',
    imageWidth = 626,
    imageHeight = 400,
    imagePosition = 'left',
    buttonLabel,
    buttonHref = '#',
    onButtonClick,
    backgroundImage,
    backgroundImageMobile,
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';
    const mobileBg = backgroundImageMobile || backgroundImage;

    return (
        <section className={`relative w-full ${className}`}>
            {/* Background - desktop */}
            {backgroundImage && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat xl:block"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}
            {/* Background - mobile */}
            {mobileBg && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat xl:hidden"
                    style={{ backgroundImage: `url(${mobileBg})` }}
                />
            )}

            <div
                className={`relative mx-auto flex w-full max-w-[1660px] flex-col items-center gap-[40px] px-[24px] py-[64px] xl:gap-[90px] xl:px-[64px] xl:py-[96px] ${
                    isImageLeft ? 'xl:flex-row' : 'xl:flex-row-reverse'
                }`}
            >
                {/* Image column */}
                {imageSrc && (
                    <div className="w-full flex justify-center xl:w-1/2">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="w-full max-w-[626px] h-auto"
                        />
                    </div>
                )}

                {/* Text column - centered on mobile, left-aligned on desktop */}
                <div className="w-full text-center xl:w-1/2 xl:text-left">
                    {label && (
                        <span className="block uppercase text-[12px] futura-medium font-medium tracking-[0.26em] text-[#d34c39]">
                            {label}
                        </span>
                    )}
                    {title && (
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] mt-[16px]">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-[#4A4A4E] text-[18px] font-normal mt-[16px] max-w-[460px] leading-relaxed mx-auto xl:mx-0">
                            {description}
                        </p>
                    )}
                    {buttonLabel && (
                        <ButtonArrow
                            label={buttonLabel}
                            href={buttonHref}
                            onClick={onButtonClick}
                            className="mt-[64px]"
                        />
                    )}
                </div>
            </div>
        </section>
    );
};

export default BaseCtaSection;
