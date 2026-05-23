'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { fetchPressReleaseList, fetchPressReleaseExcerpt } from '@/lib/b2i';
import PressReleaseCard from '@/layouts/investor-relations/press-release-card';

const ITEMS_PER_PAGE = 6;
const FALLBACK_YEARS = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

const buildPaginationRange = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const set = new Set([1, total, current, current - 1, current + 1]);
    const pages = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
    const result = [];
    pages.forEach((n, i) => {
        if (i > 0 && n - pages[i - 1] > 1) result.push('…');
        result.push(n);
    });
    return result;
};

const FilterButton = ({ active, onClick, children }) => (
    <button
        type='button'
        onClick={onClick}
        className={clsx(
            'futura-medium text-[13px] md:text-[14px] uppercase tracking-wider px-5 md:px-6 py-2 rounded-full border transition-colors',
            active
                ? 'bg-[#d34c39] text-white border-[#d34c39]'
                : 'bg-white text-[#231F20] border-[#D9D9D9] hover:border-[#d34c39] hover:text-[#d34c39]'
        )}
    >
        {children}
    </button>
);

const PageButton = ({ active, disabled, onClick, children, ariaLabel }) => (
    <button
        type='button'
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={clsx(
            'min-w-[36px] h-[36px] md:min-w-[40px] md:h-[40px] flex items-center justify-center futura-medium text-[14px] md:text-[15px] rounded-[4px] transition-colors',
            active
                ? 'bg-[#d34c39] text-white'
                : 'bg-white text-[#231F20] border border-[#D9D9D9] hover:border-[#d34c39] hover:text-[#d34c39]',
            disabled && 'opacity-40 cursor-not-allowed hover:border-[#D9D9D9] hover:text-[#231F20]'
        )}
    >
        {children}
    </button>
);

const Pagination = ({ currentPage, totalPages, onChange }) => {
    if (totalPages <= 1) return null;
    const range = buildPaginationRange(currentPage, totalPages);

    return (
        <div className='flex items-center justify-center gap-2 md:gap-3 mt-12 md:mt-16'>
            {range.map((p, idx) =>
                p === '…' ? (
                    <span key={`ellipsis-${idx}`} className='text-[#888888] px-1'>…</span>
                ) : (
                    <PageButton
                        key={p}
                        active={p === currentPage}
                        onClick={() => onChange(p)}
                        ariaLabel={`Go to page ${p}`}
                    >
                        {p}
                    </PageButton>
                )
            )}
            <PageButton
                disabled={currentPage >= totalPages}
                onClick={() => onChange(currentPage + 1)}
                ariaLabel='Next page'
            >
                ›
            </PageButton>
        </div>
    );
};

const PressReleasesList = () => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState('');
    const [availableYears, setAvailableYears] = useState(FALLBACK_YEARS);
    const sectionRef = useRef(null);

    const handlePageChange = (p) => {
        if (p === currentPage) return;
        setCurrentPage(p);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    useEffect(() => {
        const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
        const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;

        let cancelled = false;

        (async () => {
            const { items: list, totalPages: tp, availableYears: years } = await fetchPressReleaseList({
                bizId,
                apiKey,
                count: ITEMS_PER_PAGE,
                page: currentPage,
                year: selectedYear,
            });
            if (cancelled) return;

            setItems(list.map((it) => ({ ...it, desc: '' })));
            setTotalPages(tp);
            if (!selectedYear && years.length > 0) setAvailableYears(years);

            const withDescs = await Promise.all(
                list.map(async (it) => ({
                    ...it,
                    desc: await fetchPressReleaseExcerpt({ storyUrl: it.storyUrl }),
                }))
            );
            if (cancelled) return;
            setItems(withDescs);
        })();

        return () => { cancelled = true; };
    }, [currentPage, selectedYear]);

    const handleYearChange = (year) => {
        if (year === selectedYear) return;
        setSelectedYear(year);
        setCurrentPage(1);
    };

    return (
        <section ref={sectionRef} className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 scroll-mt-24'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Press Releases
            </h2>

            <div className='flex flex-wrap items-center gap-3 mt-6 md:mt-8'>
                <FilterButton active={selectedYear === ''} onClick={() => handleYearChange('')}>
                    All
                </FilterButton>
                {availableYears.map((year) => (
                    <FilterButton
                        key={year}
                        active={selectedYear === String(year)}
                        onClick={() => handleYearChange(String(year))}
                    >
                        {year}
                    </FilterButton>
                ))}
            </div>

            {items.length === 0 ? (
                <div className='mt-12 text-center text-[#888888] futura-medium'>No press releases found.</div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-[60px] mt-8 md:mt-10 lg:mt-12'>
                    {items.map((item) => (
                        <PressReleaseCard key={item.id} item={item} />
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
            />
        </section>
    );
};

export default PressReleasesList;
