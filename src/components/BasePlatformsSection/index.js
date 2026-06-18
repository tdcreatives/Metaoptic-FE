'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ButtonArrow from '@/components/ButtonArrow';

// Vector arrow sized to match the surrounding text
const ArrowRight = ({ className = 'w-[18px]' }) => (
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
 * Reusable platforms section: a heading and a responsive grid of image cards
 * (image panel + title + description + explore link), with an optional
 * call-to-action button below. Content is passed via props for reuse.
 *
 * @param {React.ReactNode} title - Section heading
 * @param {string} [description] - Supporting paragraph (right-aligned on desktop)
 * @param {Array<{image: string, imageAlt?: string, title: string, description?: string, href?: string, exploreLabel?: string}>} items
 * @param {number} [columns] - Number of columns on desktop (default 3)
 * @param {string} [buttonLabel] - Centered CTA button below the grid
 * @param {string} [buttonHref]
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BasePlatformsSection = ({
    title,
    description,
    chip,
    items = [],
    columns = 3,
    buttonLabel,
    buttonHref = '#',
    background,
    className = '',
}) => {
    const colClass =
        { 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' }[columns] ||
        'xl:grid-cols-3';

    return (
        <section
            className={className}
            style={background ? { backgroundColor: background } : undefined}
        >
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
            {(title || description) && (
                <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start xl:justify-between xl:gap-[60px]">
                    <div className="xl:flex-1">
                        {chip && (
                            <span className="inline-block rounded-full border border-black px-[34px] py-[7px] text-[14px] futura-medium font-medium uppercase tracking-[1.68px] text-[#161616]">
                                {chip}
                            </span>
                        )}
                        {title && (
                            <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] mt-[16px]">
                                {title}
                            </h2>
                        )}
                    </div>
                    {description && (
                        <p className="text-[#4A4A4E] text-[16px] xl:text-[18px] xl:text-right max-w-[460px] leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div
                className={`mt-[48px] grid grid-cols-1 sm:grid-cols-2 ${colClass} border-[1.5px] border-[#00000017]`}
            >
                {items.map((item, index) => (
                    <div
                        key={item.title || index}
                        className="flex flex-col border-b-[1.5px] last:border-b-0 xl:border-b-0 xl:border-r-[1.5px] xl:last:border-r-0 border-[#00000017]"
                    >
                        {/* Image panel */}
                        <div className="flex items-center justify-center bg-[#F4F2EF] px-[24px] py-[40px]">
                            <Image
                                src={item.image}
                                alt={item.imageAlt || item.title || ''}
                                width={232}
                                height={217}
                                className="h-[200px] w-auto object-contain"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-[8px] border-t-[1.5px] border-[#00000017] p-[24px]">
                            {item.title && (
                                <h3 className="text-[19px] futura-medium font-medium tracking-[0.02em] text-[#0B0B0C]">
                                    {item.title}
                                </h3>
                            )}
                            {item.description && (
                                <p className="text-[15.5px] font-normal text-[#4A4A4E] leading-relaxed">
                                    {item.description}
                                </p>
                            )}
                            {item.href !== undefined && (
                                <Link
                                    href={item.href || '#'}
                                    className="mt-[8px] inline-flex items-center gap-[8px] uppercase text-[16px] futura-medium font-medium tracking-[0.1em] text-[#d34c39] hover:opacity-80 transition-opacity"
                                >
                                    {item.exploreLabel || 'Explore'}
                                    <ArrowRight className="w-[18px]" />
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {buttonLabel && (
                <div className="mt-[40px] flex justify-center">
                    <ButtonArrow label={buttonLabel} href={buttonHref} />
                </div>
            )}
            </div>
        </section>
    );
};

export default BasePlatformsSection;
