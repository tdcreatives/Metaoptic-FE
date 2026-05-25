'use client';

import React, { useMemo, useRef, useState } from 'react';
import newsData from '@/constants/news.json';
import BaseNewsCard from '@/components/BaseNewsCard';
import IRContainer from '@/layouts/investor-relations/container';
import { FilterButton, Pagination } from './list-controls';

const ITEMS_PER_PAGE = 6;

const extractYear = (dateStr) => {
    const m = (dateStr || '').match(/\b(20\d{2})\b/);
    return m ? Number(m[1]) : null;
};

const MediaList = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const sectionRef = useRef(null);

    const sortedItems = useMemo(() => {
        const items = newsData.news || [];
        return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    }, []);

    const availableYears = useMemo(() => {
        const set = new Set();
        sortedItems.forEach((n) => {
            const y = extractYear(n.date);
            if (y) set.add(y);
        });
        return [...set].sort((a, b) => b - a);
    }, [sortedItems]);

    const filtered = useMemo(() => {
        if (!selectedYear) return sortedItems;
        return sortedItems.filter((n) => String(extractYear(n.date)) === selectedYear);
    }, [sortedItems, selectedYear]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const pagedItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleYearChange = (year) => {
        if (year === selectedYear) return;
        setSelectedYear(year);
        setCurrentPage(1);
    };

    const handlePageChange = (p) => {
        if (p === currentPage) return;
        setCurrentPage(p);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <IRContainer as='section' ref={sectionRef} className='py-12 md:py-16 lg:py-20 scroll-mt-24'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Media
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

            {pagedItems.length === 0 ? (
                <div className='mt-12 text-center text-[#888888] futura-medium'>No media coverage found.</div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-[60px] mt-8 md:mt-10 lg:mt-12'>
                    {pagedItems.map((item) => (
                        <BaseNewsCard key={item.slug} news={item} />
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={handlePageChange}
            />
        </IRContainer>
    );
};

export default MediaList;
