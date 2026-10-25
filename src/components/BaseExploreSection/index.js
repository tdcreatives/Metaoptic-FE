'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
 * Reusable "explore" section: a header (eyebrow label + heading on the left,
 * supporting paragraph on the right) followed by a responsive grid of cards.
 * Each card has an icon panel, a number, title, description and an Explore link.
 *
 * @param {string} label - Small uppercase eyebrow label
 * @param {React.ReactNode} title - Section heading
 * @param {string} description - Supporting paragraph (right-aligned on desktop)
 * @param {Array<{number?: string, icon: string, title: string, description?: string, href?: string, exploreLabel?: string}>} items
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseExploreSection = ({
    label,
    title,
    description,
    items = [],
    columns = 4,
    className = '',
}) => {
    // Static class map so Tailwind can detect the grid columns at build time
    const colClass =
        { 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4' }[columns] ||
        'xl:grid-cols-4';

    return (
        <section
            className={`mx-auto w-full max-w-[1660px] px-[24px] py-[64px] xl:px-[72px] xl:py-[60px] ${className}`}
        >
            {/* Header */}
            <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start xl:gap-[60px]">
                <div className="xl:flex-1">
                    {label && (
                        <span className="block uppercase text-[12px] font-normal tracking-[0.2em] text-[#d34c39]">
                            {label}
                        </span>
                    )}
                    {title && (
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px] mt-[12px]">
                            {title}
                        </h2>
                    )}
                </div>
                {description && (
                    <p className="text-[#4A4A4E] text-[16px] xl:text-[18px] text-left xl:flex-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {/* Cards */}
            <div className={`mt-[40px] grid grid-cols-1 sm:grid-cols-2 ${colClass} border-2 border-[#E5E5E5]`}>
                {items.map((item, index) => {
                    const cardClass =
                        'flex flex-col border-b last:border-b-0 xl:border-b-0 xl:border-r xl:last:border-r-0 border-[#E5E5E5]';
                    const hasLink = item.href !== undefined;
                    const Wrapper = hasLink ? Link : 'div';
                    const wrapperProps = hasLink
                        ? { href: item.href || '#', className: `${cardClass} group` }
                        : { className: cardClass };

                    return (
                        <Wrapper key={item.title || index} {...wrapperProps}>
                            {/* Icon panel - full bleed, no padding */}
                            <div className="bg-[#F4F2EF] flex items-center justify-center h-[200px]">
                                <Image
                                    src={item.icon}
                                    alt={item.title || ''}
                                    width={95}
                                    height={84}
                                    className="w-[95px] h-[84px] object-contain"
                                />
                            </div>

                            {/* Content - padded 24px */}
                            <div className="flex flex-col p-[24px]">
                                <div className="h-[136px]">
                                    {item.number && (
                                        <span className="block text-[11px] font-normal text-[#8A8A8F]">
                                            {item.number}
                                        </span>
                                    )}
                                    {item.title && (
                                        <h3 className="text-[19px] futura-medium font-medium text-[#0B0B0C] mt-[8px]">
                                            {item.title}
                                        </h3>
                                    )}
                                    {item.description && (
                                        <p className="text-[15.5px] font-normal text-[#4A4A4E] mt-[8px] leading-relaxed">
                                            {item.description}
                                        </p>
                                    )}
                                </div>

                                {hasLink && (
                                    <span className="inline-flex items-center gap-[8px] py-[18.5px] uppercase text-[16px] futura-medium font-medium tracking-[0.1em] text-[#d34c39] transition-opacity group-hover:opacity-80">
                                        {item.exploreLabel || 'Explore'}
                                        <ArrowRight className="w-[18px]" />
                                    </span>
                                )}
                            </div>
                        </Wrapper>
                    );
                })}
            </div>
        </section>
    );
};

export default BaseExploreSection;
