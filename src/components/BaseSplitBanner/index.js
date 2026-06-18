'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ButtonArrow from '@/components/ButtonArrow';

// Vector arrow sized to match the surrounding text
const ArrowIcon = ({ className = 'w-[18px]' }) => (
    <svg
        className={`${className} h-auto`}
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M1 8h21M15 1l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

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
 * @param {string} [videoSrc] - When set, renders an autoplaying muted video instead of the image
 * @param {string} [posterSrc] - Poster image shown before the video loads
 * @param {'left'|'right'} [imagePosition] - Side the media sits on (default 'right')
 * @param {string} [buttonLabel] - Primary pill button
 * @param {string} [buttonHref]
 * @param {function} [onButtonClick]
 * @param {string} [secondaryLabel] - Secondary text link with arrow
 * @param {string} [secondaryHref]
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
    videoSrc,
    posterSrc,
    imagePosition = 'right',
    buttonLabel,
    buttonHref = '#',
    onButtonClick,
    secondaryLabel,
    secondaryHref = '#',
    rounded = false,
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';

    // When the primary button points to an in-page anchor (#id), smooth-scroll instead of navigating
    const handlePrimaryClick = (event) => {
        if (buttonHref && buttonHref.startsWith('#')) {
            const target =
                typeof document !== 'undefined' && document.querySelector(buttonHref);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
        if (onButtonClick) onButtonClick(event);
    };

    // Buttons are shared between the text column (desktop) and below the image (mobile)
    const actions = (buttonLabel || secondaryLabel) && (
        <>
            {buttonLabel && (
                <ButtonArrow label={buttonLabel} href={buttonHref} onClick={handlePrimaryClick} />
            )}
            {secondaryLabel && (
                <Link
                    href={secondaryHref}
                    className="inline-flex items-center gap-[8px] uppercase text-[14px] tracking-[0.1em] futura-medium font-medium text-[#0B0B0C] hover:opacity-80 transition-opacity"
                >
                    {secondaryLabel}
                    <ArrowIcon className="w-[18px]" />
                </Link>
            )}
        </>
    );

    return (
        <section className={`bg-[#F6F5F5] ${className}`}>
            <div
                className={`mx-auto flex w-full max-w-[1660px] flex-col items-center gap-[56px] px-[24px] py-[40px] xl:gap-[60px] xl:px-[72px] xl:py-[120px] ${
                    isImageLeft ? 'xl:flex-row-reverse' : 'xl:flex-row'
                }`}
            >
                {/* Text column */}
                <div className="w-full xl:flex-1">
                    {title && (
                        <h1 className="futura-condensed-medium font-medium uppercase text-[#d34c39] text-[64px] leading-[1.1] md:text-[72px] xl:text-[100px] xl:leading-[110px]">
                            {title}
                        </h1>
                    )}

                    {subtitle && (
                        <p className="futura-medium text-[#0B0B0C] text-[19px] xl:text-[22px] mt-[16px] xl:mt-[24px] max-w-[520px]">
                            {subtitle}
                        </p>
                    )}

                    {description && (
                        <p className="text-[#4A4A4E] text-[16px] xl:text-[17px] font-normal mt-[16px] xl:mt-[20px] max-w-[520px] leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Buttons - desktop: in the text column */}
                    {actions && (
                        <div className="mt-[32px] hidden flex-wrap items-center gap-[24px] xl:flex">
                            {actions}
                        </div>
                    )}
                </div>

                {/* Media column */}
                {(videoSrc || imageSrc) && (
                    <div
                        className={`w-full flex flex-col items-center xl:flex-1 ${
                            isImageLeft ? 'xl:items-start' : 'xl:items-end'
                        }`}
                    >
                        {videoSrc ? (
                            <video
                                className="w-full max-w-[720px] h-auto rounded-[16px] object-cover xl:h-[560px]"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                poster={posterSrc}
                            >
                                <source src={videoSrc} type="video/mp4" />
                            </video>
                        ) : (
                            <Image
                                src={imageSrc}
                                alt={imageAlt}
                                width={imageWidth}
                                height={imageHeight}
                                className={`w-full max-w-[720px] ${
                                    rounded
                                        ? 'h-auto object-cover rounded-[16px] xl:h-[560px]'
                                        : 'h-auto'
                                }`}
                                priority
                            />
                        )}

                        {/* Buttons - mobile: below the image */}
                        {actions && (
                            <div className="mt-[32px] flex flex-wrap items-center justify-center gap-[24px] xl:hidden">
                                {actions}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BaseSplitBanner;
