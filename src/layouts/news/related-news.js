'use client';

import React from 'react';

import BaseNewsCard from '@/components/BaseNewsCard';

const RelatedNews = ({ relatedNews = [] }) => {
    if (relatedNews.length === 0) return <></>;
    return (
        <div className='xl:mt-[72px] mt-[48px]'>
            <h2 className='xl:text-[72px] text-[32px] text-center text-[#d34c39] uppercase futura-condensed-medium mb-8'>
                Recent News
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-[60px] gap-0'>
                {relatedNews.map((news, index) => (
                    <BaseNewsCard
                        key={news.id}
                        news={news}
                        className={index % 3 === 1 ? 'mt-[60px]' : ''}
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedNews;
