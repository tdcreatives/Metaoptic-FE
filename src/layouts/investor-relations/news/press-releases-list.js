'use client';

import React, { useEffect, useRef, useState } from 'react';
import { fetchPressReleaseList, fetchPressReleaseExcerpt } from '@/lib/b2i';
import PressReleaseCard from '@/layouts/investor-relations/press-release-card';
import { FilterButton, Pagination } from './list-controls';

const ITEMS_PER_PAGE = 6;
const FALLBACK_YEARS = [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2];

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
