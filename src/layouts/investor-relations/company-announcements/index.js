'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import rawItems from '@/constants/announcements.json';
import {
    ITEMS_PER_PAGE,
    filterAnnouncements,
    getCategoryCounts,
    normalizeAnnouncement,
    sortAnnouncements,
} from '@/utils/announcements';
import AnnouncementFilters from './filters';
import { AnnouncementCards, AnnouncementTable } from './table';
import AnnouncementPaginationFooter from './pagination-footer';

const CompanyAnnouncementsSection = () => {
    const sectionRef = useRef(null);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedItems = useMemo(() => sortAnnouncements(rawItems), []);
    const categoryCounts = useMemo(() => getCategoryCounts(sortedItems), [sortedItems]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    const filteredItems = useMemo(
        () =>
            filterAnnouncements(sortedItems, {
                search: debouncedSearch,
                dateFrom,
                dateTo,
                categories: selectedCategories,
            }),
        [sortedItems, debouncedSearch, dateFrom, dateTo, selectedCategories]
    );

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
    const pagedItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems
            .slice(start, start + ITEMS_PER_PAGE)
            .map(normalizeAnnouncement);
    }, [filteredItems, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, dateFrom, dateTo, selectedCategories]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handlePageChange = (page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section
            ref={sectionRef}
            className="w-full bg-[#f6f6f6] rounded-t-lg px-4 md:px-8 xl:px-20 py-10 md:py-12 scroll-mt-24"
        >
            <div className="w-full max-w-[1920px] mx-auto flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <h2 className="futura-condensed-medium font-medium text-[#d34c39] text-[32px] md:text-[40px] xl:text-[48px] uppercase leading-tight">
                        Company ANNOUNCEMENTS
                    </h2>
                    <div className="w-full h-[2px] bg-[#b5b5b5] opacity-50" />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-6 w-full">
                    <AnnouncementFilters
                        search={search}
                        onSearchChange={setSearch}
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onDateFromChange={setDateFrom}
                        onDateToChange={setDateTo}
                        selectedCategories={selectedCategories}
                        onCategoryToggle={handleCategoryToggle}
                        categoryCounts={categoryCounts}
                    />

                    <div className="flex-1 min-w-0 bg-white rounded-[24px] px-4 md:px-6 py-8 flex flex-col gap-8">
                        <AnnouncementTable items={pagedItems} />
                        <AnnouncementCards items={pagedItems} />
                        <AnnouncementPaginationFooter
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalResults={filteredItems.length}
                            pageSize={ITEMS_PER_PAGE}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompanyAnnouncementsSection;
