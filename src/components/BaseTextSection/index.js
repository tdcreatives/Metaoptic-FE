'use client';

import React from 'react';

/**
 * Reusable two-column text section: a heading on the left and a paragraph on
 * the right. Content is passed via props for reuse.
 *
 * @param {React.ReactNode} title - Heading (pass a node to control line breaks)
 * @param {string} description
 * @param {string} [background] - Section background color (default '#F4F2EF')
 * @param {React.ReactNode} [children] - Extra content rendered below the header
 * @param {string} [className] - Extra classes for the outer <section>
 */
const BaseTextSection = ({
    title,
    description,
    background = '#F4F2EF',
    children,
    className = '',
}) => {
    return (
        <section className={className} style={{ backgroundColor: background }}>
            <div className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
                <div className="flex flex-col items-start gap-[48px] xl:flex-row">
                    {title && (
                        <h2 className="futura-condensed-medium font-medium uppercase text-[#0B0B0C] text-[40px] leading-[1.1] xl:text-[64px] xl:flex-1">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-[#4A4A4E] text-[18px] font-normal leading-relaxed xl:flex-1">
                            {description}
                        </p>
                    )}
                </div>
                {children}
            </div>
        </section>
    );
};

export default BaseTextSection;
