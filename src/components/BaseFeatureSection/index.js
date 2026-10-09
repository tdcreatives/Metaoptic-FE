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
 * @param {string} [videoSrc] - Render a looping video instead of an image
 * @param {string} [posterSrc] - Poster for the video
 * @param {string} [frameSrc] - Image used as the offset frame (overrides the CSS border)
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
    videoSrc,
    posterSrc,
    frameSrc,
    children,
    imageBottomMobile = false,
    decorSrc,
    className = '',
}) => {
    const isImageLeft = imagePosition === 'left';
    const hasMedia = videoSrc || imageSrc;

    return (
        <section
            className={`relative overflow-hidden bg-[#F6F5F5] border-y border-black/[0.09] ${className}`}
        >
            {decorSrc && (
                <Image
                    src={decorSrc}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="100vw"
                    className="pointer-events-none select-none object-cover"
                    priority={false}
                />
            )}
            <div
                className={`relative z-[1] mx-auto flex w-full max-w-[1660px] items-center gap-[40px] px-[24px] py-[64px] xl:gap-[80px] xl:px-[72px] xl:py-[96px] ${
                    imageBottomMobile ? 'flex-col-reverse' : 'flex-col'
                } ${isImageLeft ? 'xl:flex-row' : 'xl:flex-row-reverse'}`}
            >
                {/* Media column */}
                {hasMedia && (
                    <div className="w-full flex justify-center xl:flex-1 xl:justify-start">
                        <div className="relative w-full max-w-[582px]">
                            {framed && !frameSrc && (
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 translate-x-[20px] translate-y-[20px] rounded-[12px] border border-[#d34c39]/40"
                                />
                            )}
                            {frameSrc && (
                                <Image
                                    src={frameSrc}
                                    alt=""
                                    aria-hidden="true"
                                    width={354}
                                    height={278}
                                    className="pointer-events-none absolute right-[-20px] bottom-[-20px] z-0 w-[354px] h-[278px]"
                                />
                            )}
                            {videoSrc ? (
                                <video
                                    src={videoSrc}
                                    poster={posterSrc}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="relative z-[1] w-full h-auto rounded-[12px]"
                                />
                            ) : (
                                <Image
                                    src={imageSrc}
                                    alt={imageAlt}
                                    width={imageWidth}
                                    height={imageHeight}
                                    className="relative z-[1] w-full h-auto"
                                />
                            )}
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

                    {children}
                </div>
            </div>
        </section>
    );
};

export default BaseFeatureSection;
