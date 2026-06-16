'use client';

import React from 'react';
import Image from 'next/image';

import ButtonArrow from '@/components/ButtonArrow';

/**
 * Reusable split hero banner: a text column on one side and an illustration on
 * the other. All content is passed via props so it can be reused across pages
 * (verticals overview, vertical detail pages, etc.). Use `imagePosition` to
 * flip the layout.
 *
 * @param {React.ReactNode} title - Heading (pass a node to control line breaks)
 * @param {string} subtitle
 * @param {string} description
 * @param {string} imageSrc
 * @param {string} [imageAlt]
 * @param {number} [imageWidth]
 * @param {number} [imageHeight]
 * @param {'left'|'right'} [imagePosition] - Side the image sits on (default 'right')
 * @param {string} [buttonLabel]
 * @param {string} [buttonHref]
 * @param {function} [onButtonClick]
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseSplitBanner = ({
    title,
    subtitle,
    description,
    imageSrc,
    imageAlt = '',
    imageWidth = 687,
    imageHeight = 671,
    imagePosition = 'right',
    buttonLabel,
    buttonHref = '#',
    onButtonClick,
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';

    return (
        <section
            className={`mx-auto w-full max-w-[1660px] px-[24px] py-[40px] xl:px-[72px] xl:py-[60px] ${className}`}
        >
            <div
                className={`flex flex-col items-center gap-[40px] xl:gap-[60px] ${
                    isImageLeft ? 'xl:flex-row-reverse' : 'xl:flex-row'
                }`}
            >
                {/* Text column */}
                <div className="w-full xl:flex-1">
                    {title && (
                        <h1 className="futura-condensed-medium font-medium uppercase text-[#d34c39] text-[48px] leading-[1.1] md:text-[72px] xl:text-[100px] xl:leading-[110px]">
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p className="futura-medium text-[#0B0B0C] text-[18px] xl:text-[22px] mt-[24px] max-w-[520px]">
                            {subtitle}
                        </p>
                    )}

                    {description && (
                        <p className="text-[#4A4A4E] text-[15px] xl:text-[17px] font-normal mt-[20px] max-w-[520px] leading-relaxed">
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

                {/* Image column */}
                {imageSrc && (
                    <div
                        className={`w-full flex justify-center xl:flex-1 ${
                            isImageLeft ? 'xl:justify-start' : 'xl:justify-end'
                        }`}
                    >
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={imageWidth}
                            height={imageHeight}
                            className="w-full max-w-[687px] h-auto"
                            priority
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default BaseSplitBanner;
