'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const TableHeader = ({ children, className }) => (
    <div
        className={clsx(
            'futura-condensed-medium text-[#d34c39] text-[18px] md:text-[20px] xl:text-[24px] uppercase',
            'border-b border-[#e0e1e0] pb-3 px-4',
            className
        )}
    >
        {children}
    </div>
);

const AnnouncementRow = ({ item, striped }) => (
    <div
        className={clsx(
            'grid grid-cols-[minmax(140px,192px)_1fr_minmax(160px,211px)] items-center min-h-[100px]',
            striped ? 'bg-[#f6f6f6]' : 'bg-white'
        )}
    >
        <div className="border-b border-[#e0e1e0] h-full flex flex-col justify-center px-4 py-4">
            <span className="futura-medium text-[16px] md:text-[18px] text-[#231f20] leading-[30px] whitespace-nowrap">
                {item.filingDate}
            </span>
            {item.filingTime && (
                <span className="futura-medium text-[14px] md:text-[16px] text-[#a9a9a9] leading-[22px]">
                    {item.filingTime}
                </span>
            )}
        </div>
        <div className="border-b border-[#e0e1e0] h-full flex items-center px-4 py-4">
            <Link
                href={`/company-announcement/${item.slug}`}
                className="futura-medium text-[16px] md:text-[20px] text-[#231f20] leading-[30px] capitalize hover:text-[#d34c39] hover:underline transition-colors"
            >
                {item.displayTitle}
            </Link>
        </div>
        <div className="border-b border-[#e0e1e0] h-full flex items-center px-4 py-4">
            <span className="futura-medium text-[16px] md:text-[18px] text-[#231f20] leading-6">
                {item.category}
            </span>
        </div>
    </div>
);

export const AnnouncementTable = ({ items }) => {
    if (items.length === 0) {
        return (
            <div className="py-16 text-center futura-medium text-[#888888] text-[16px] md:text-[18px]">
                No announcements found.
            </div>
        );
    }

    return (
        <div className="hidden lg:block w-full">
            <div className="grid grid-cols-[minmax(140px,192px)_1fr_minmax(160px,211px)]">
                <TableHeader>Filling Date</TableHeader>
                <TableHeader>Title</TableHeader>
                <TableHeader>Category</TableHeader>
            </div>
            {items.map((item, index) => (
                <AnnouncementRow key={item.id} item={item} striped={index % 2 === 1} />
            ))}
        </div>
    );
};

export const AnnouncementCards = ({ items }) => {
    if (items.length === 0) {
        return (
            <div className="py-12 text-center futura-medium text-[#888888] text-[16px]">
                No announcements found.
            </div>
        );
    }

    return (
        <div className="lg:hidden flex flex-col gap-4">
            {items.map((item) => (
                <div key={item.id} className="bg-[#f6f6f6] rounded-[12px] p-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <span className="futura-medium text-[12px] text-[#888888] uppercase">Filling Date</span>
                        <span className="futura-medium text-[15px] text-[#231f20]">{item.filingDate}</span>
                        {item.filingTime && (
                            <span className="futura-medium text-[13px] text-[#a9a9a9]">{item.filingTime}</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="futura-medium text-[12px] text-[#888888] uppercase">Title</span>
                        <Link
                            href={`/company-announcement/${item.slug}`}
                            className="futura-medium text-[15px] text-[#231f20] hover:text-[#d34c39] hover:underline"
                        >
                            {item.displayTitle}
                        </Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="futura-medium text-[12px] text-[#888888] uppercase">Category</span>
                        <span className="futura-medium text-[15px] text-[#231f20]">{item.category}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
