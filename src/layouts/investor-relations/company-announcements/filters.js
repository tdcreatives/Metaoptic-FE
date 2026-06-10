'use client';

import React from 'react';
import clsx from 'clsx';
import { IconCheck } from '@tabler/icons-react';
import { ANNOUNCEMENT_CATEGORIES } from '@/utils/announcements';

const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM16.5 16.5 21 21"
            stroke="#B5B5B5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const FilterLabel = ({ children }) => (
    <span className="futura-medium text-[#d34c39] text-[14px] md:text-[16px] uppercase tracking-[2px]">
        {children}
    </span>
);

const DateField = ({ value, onChange, ariaLabel }) => (
    <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className={clsx(
            'flex-1 min-w-0 w-full border border-[#b5b5b5] rounded-[8px] px-4 py-4',
            'futura-medium text-[16px] text-[#231f20] bg-white',
            'focus:outline-none focus:border-[#d34c39]',
            !value && 'text-[#b5b5b5]'
        )}
    />
);

const CategoryCheckbox = ({ checked, label, count, onChange }) => (
    <label className="flex items-start gap-4 cursor-pointer select-none">
        <span
            className={clsx(
                'mt-0.5 size-6 shrink-0 rounded-[4px] border flex items-center justify-center transition-colors',
                checked ? 'bg-[#d34c39] border-[#d34c39]' : 'bg-white border-[#a9a9a9]'
            )}
        >
            {checked && <IconCheck size={16} className="text-white" strokeWidth={3} />}
        </span>
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
        <span className="flex-1 futura-medium text-[16px] md:text-[18px] text-[#231f20] leading-6">
            {label}
        </span>
        <span className="futura-medium text-[16px] text-[#a9a9a9] leading-6">{count}</span>
    </label>
);

const AnnouncementFilters = ({
    search,
    onSearchChange,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    selectedCategories,
    onCategoryToggle,
    categoryCounts,
}) => (
    <aside className="w-full lg:w-[404px] shrink-0 bg-white rounded-[24px] px-6 py-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
            <FilterLabel>Search</FilterLabel>
            <div className="flex items-center gap-3 border border-[#b5b5b5] rounded-[8px] px-4 py-4">
                <SearchIcon />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search Announcement"
                    className="flex-1 futura-medium text-[16px] text-[#231f20] placeholder:text-[#b5b5b5] bg-transparent focus:outline-none"
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <FilterLabel>Day range</FilterLabel>
            <div className="flex gap-4">
                <DateField value={dateFrom} onChange={onDateFromChange} ariaLabel="From date" />
                <DateField value={dateTo} onChange={onDateToChange} ariaLabel="To date" />
            </div>
        </div>

        <div className="flex flex-col gap-6">
            <FilterLabel>Category</FilterLabel>
            <div className="flex flex-col gap-6">
                {ANNOUNCEMENT_CATEGORIES.map((category) => (
                    <CategoryCheckbox
                        key={category}
                        label={category}
                        count={categoryCounts[category] || 0}
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryToggle(category)}
                    />
                ))}
            </div>
        </div>
    </aside>
);

export default AnnouncementFilters;
