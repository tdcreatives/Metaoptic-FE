'use client';

import React from 'react';
import { PageButton, buildPaginationRange } from '@/layouts/investor-relations/news/list-controls';

const AnnouncementPaginationFooter = ({
    currentPage,
    totalPages,
    totalResults,
    pageSize,
    onChange,
}) => {
    if (totalResults === 0) return null;

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalResults);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full px-4 pt-2">
            <p className="futura-medium text-[16px] md:text-[20px] text-[#888888] leading-7">
                Showing {startIndex}-{endIndex} of {totalResults} results
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-2 md:gap-[19px] justify-start sm:justify-end">
                    {buildPaginationRange(currentPage, totalPages).map((p, idx) =>
                        p === '…' ? (
                            <span key={`ellipsis-${idx}`} className="futura-medium text-[16px] text-[#231f20] px-2">
                                …
                            </span>
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
                        ariaLabel="Next page"
                    >
                        ›
                    </PageButton>
                </div>
            )}
        </div>
    );
};

export default AnnouncementPaginationFooter;
