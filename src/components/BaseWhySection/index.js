'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Reusable "why" section: a heading followed by a responsive row of cards.
 * Each card shows a number, title and description at the top and an icon
 * anchored to the bottom. Content is passed via props for reuse.
 *
 * @param {React.ReactNode} title - Section heading
 * @param {Array<{number?: string, icon: string, title: string, description?: string}>} items
 * @param {number} [columns] - Number of columns on desktop (default 4)
 * @param {'left'|'center'|'right'} [iconAlign] - Horizontal alignment of the card icon (default 'right')
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseWhySection = ({
    title,
    items = [],
    columns = 4,
    iconAlign = 'right',
    iconSize = 110,
    cardMinHeight = 340,
    className = '',
}) => {
    // Static class maps so Tailwind can detect them at build time
    const colClass =
        { 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5' }[
            columns
        ] || 'xl:grid-cols-4';
    const iconAlignClass =
        { left: 'justify-start', center: 'justify-center', right: 'justify-end' }[iconAlign] ||
        'justify-end';

    return (
        <section className={`bg-[#F4F2EF] ${className}`}>
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
                {title && (
                    <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.05] xl:text-[64px]">
                        {title}
                    </h2>
                )}

                <div className={`mt-[40px] grid grid-cols-1 gap-[8px] sm:grid-cols-2 ${colClass}`}>
                    {items.map((item, index) => (
                        <div
                            key={item.title || index}
                            className="flex flex-col bg-white p-[24px]"
                            style={{ minHeight: cardMinHeight }}
                        >
                        {item.number && (
                            <span className="text-[20px] futura-medium font-medium text-[#8A8A8F]">
                                {item.number}
                            </span>
                        )}
                        {item.title && (
                            <h3 className="mt-[12px] text-[22px] futura-medium font-medium text-[#0B0B0C]">
                                {item.title}
                            </h3>
                        )}
                        {item.description && (
                            <p className="mt-[8px] text-[14.5px] font-normal text-[#6C6C6C] leading-relaxed">
                                {item.description}
                            </p>
                        )}

                        {item.icon && (
                            <div className={`mt-auto flex ${iconAlignClass} pt-[24px]`}>
                                <Image
                                    src={item.icon}
                                    alt={item.title || ''}
                                    width={iconSize}
                                    height={iconSize}
                                    className="object-contain"
                                    style={{ width: iconSize, height: iconSize }}
                                />
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BaseWhySection;
