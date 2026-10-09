'use client';

import React from 'react';
import Image from 'next/image';
import DownloadIconButton from '@/components/DownloadIconButton';
import { toBrochureFileName } from '@/utils/product';

// ponytail: column card tints from Figma — light for first, darker for rest
const COLUMN_CARD_BG = [
    'bg-[rgba(198,198,198,0.1)]',
    'bg-[rgba(49,49,49,0.1)]',
];

const sectionIcon = (sectionKey) => {
    switch (sectionKey) {
        case 'substrateSpecifications':
            return {
                src: '/product-details/mechanic.png',
                alt: '',
                className: 'w-6 h-[35px] object-contain',
            };
        case 'metalensSpecifications':
            return {
                src: '/product-details/metalens.png',
                alt: '',
                className: 'w-6 h-[30px] object-contain',
            };
        default:
            return null;
    }
};

const RowBorder = ({
    children,
    className = '',
    showBorder = true,
    ...rest
}) => (
    <div
        className={`flex items-center min-h-[62px] ${
            showBorder ? 'border-b border-white/28' : ''
        } ${className}`}
        {...rest}>
        {children}
    </div>
);

const PlaceholderColumn = ({ placeholderColumn }) => {
    if (!placeholderColumn?.label) return null;

    const {
        label,
        title = 'DESIGN IN PROGRESS',
        subtitle,
        icon = '/product-details/design-in-progress.svg',
    } = placeholderColumn;

    return (
        <div className='flex flex-col flex-1 min-w-[200px] min-h-[420px] rounded-[12px] border border-dashed border-white/80 px-4 pt-4 pb-6'>
            <div className='h-[72px] flex items-center px-2 shrink-0'>
                <div className='w-full h-14 flex items-center justify-center rounded-full border border-white'>
                    <span className='futura-condensed-medium text-[20px] xl:text-[24px] text-center'>
                        {label}
                    </span>
                </div>
            </div>

            <div className='flex-1 flex flex-col items-center justify-center gap-4 px-2 text-center'>
                <Image
                    src={icon}
                    alt=''
                    aria-hidden='true'
                    width={88}
                    height={88}
                    className='w-[72px] h-[72px] xl:w-[88px] xl:h-[88px] object-contain'
                />
                <p className='futura-condensed-medium uppercase tracking-[1px] text-[16px] xl:text-[20px] leading-tight'>
                    {title}
                </p>
                {subtitle && (
                    <p className='futura-book text-[14px] xl:text-[16px] text-white/90'>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

const ProductDetailsSpecComparison = ({
    specComparison,
    brochureTitle,
    brochure,
}) => {
    if (!specComparison?.columns?.length || !specComparison?.sections?.length) {
        return null;
    }

    const { columns, sections, placeholderColumn } = specComparison;

    return (
        <section className='w-full bg-[#d34c39] text-white rounded-[32px] pt-12 pb-16 px-6 lg:px-10 flex flex-col gap-8'>
            <h2 className='futura-condensed-medium uppercase text-[32px] lg:text-[40px] xl:text-[48px] leading-tight text-center'>
                Specifications
            </h2>

            <div className='flex gap-3 overflow-x-auto items-stretch'>
                {/* Label column */}
                <div className='flex flex-col shrink-0 w-[min(100%,280px)] xl:w-[374px] min-w-[220px]'>
                    <div className='h-[85px]' aria-hidden='true' />

                    {sections.map((section, sectionIndex) => {
                        const isFirstSection = sectionIndex === 0;
                        return (
                            <div
                                key={section.key || section.title}
                                className={isFirstSection ? '' : 'pt-10'}>
                                <RowBorder
                                    className={`gap-3 ${isFirstSection ? '' : 'min-h-12'}`}
                                    showBorder={isFirstSection}>
                                    {(() => {
                                        const icon = sectionIcon(section.key);
                                        if (!icon) return null;
                                        return (
                                            <Image
                                                src={icon.src}
                                                alt={icon.alt}
                                                aria-hidden='true'
                                                width={24}
                                                height={35}
                                                className={icon.className}
                                            />
                                        );
                                    })()}
                                    <span className='futura-condensed-medium uppercase tracking-[1px] text-[16px] xl:text-[20px]'>
                                        {section.title}
                                    </span>
                                </RowBorder>

                                {section.rows?.map((row, rowIndex) => {
                                    const isLast =
                                        sectionIndex === sections.length - 1 &&
                                        rowIndex === section.rows.length - 1;
                                    return (
                                        <RowBorder
                                            key={row.label}
                                            showBorder={!isLast}>
                                            <span className='futura-medium text-[15px] xl:text-[18px]'>
                                                {row.label}
                                            </span>
                                        </RowBorder>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                {/* Value columns — each in its own card (Figma) */}
                {columns.map((col, colIndex) => (
                    <div
                        key={col}
                        className={`flex flex-col flex-1 min-w-[200px] rounded-[12px] px-4 pt-4 pb-2 ${
                            COLUMN_CARD_BG[colIndex] || COLUMN_CARD_BG[1]
                        }`}>
                        <div className='h-[72px] flex items-center px-2 shrink-0'>
                            <div className='w-full h-14 flex items-center justify-center rounded-full border border-white'>
                                <span className='futura-condensed-medium text-[20px] xl:text-[24px] text-center'>
                                    {col}
                                </span>
                            </div>
                        </div>

                        {sections.map((section, sectionIndex) => {
                            const isFirstSection = sectionIndex === 0;
                            return (
                                <div
                                    key={`${col}-${section.key || section.title}`}
                                    className={isFirstSection ? '' : 'pt-10'}>
                                    <RowBorder
                                        className={`px-2 ${isFirstSection ? '' : 'min-h-12'}`}
                                        showBorder={isFirstSection}
                                        aria-hidden='true'
                                    />

                                    {section.rows?.map((row, rowIndex) => {
                                        const isLast =
                                            sectionIndex === sections.length - 1 &&
                                            rowIndex === section.rows.length - 1;
                                        return (
                                            <RowBorder
                                                key={`${col}-${row.label}`}
                                                className='px-2 justify-center'
                                                showBorder={!isLast}>
                                                <span className='futura-book text-[15px] xl:text-[18px] text-center'>
                                                    {row.values?.[colIndex] ?? '—'}
                                                </span>
                                            </RowBorder>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Opt-in coming-soon column (24MP etc.) — only when data provides it */}
                <PlaceholderColumn placeholderColumn={placeholderColumn} />
            </div>

            {brochure && (
                <div className='flex justify-center pt-12'>
                    <DownloadIconButton
                        label='Brochure'
                        href={brochure}
                        download={toBrochureFileName(brochureTitle)}
                        variant='light'
                    />
                </div>
            )}
        </section>
    );
};

export default ProductDetailsSpecComparison;
