'use client';

import React from 'react';
import data from '@/constants/news.json';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseTitle from '@/components/BaseTitle';

const MOD = process.env.NEXT_PUBLIC_MOD || 'production';

const shouldIncludeNewsItem = (item) =>
    MOD === 'development' || !item.mod || item.mod === 'production';

const sortByDateDesc = (items) =>
    [...items].sort((a, b) => new Date(b.date) - new Date(a.date));

const NewsCardGrid = ({ items }) => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-5 w-full max-w-6xl mt-8 xl:px-0 xl:px-10 px-6'>
        {items.map((news, index) => (
            <div
                key={news.id}
                className={`${index % 3 === 1 ? 'xl:mt-[100px]' : ''}`}>
                <BaseNewsCard news={news} />
            </div>
        ))}
    </div>
);

const NewsList = () => {
    const visibleNews = data.news.filter(shouldIncludeNewsItem);
    const sgxNews = sortByDateDesc(
        visibleNews.filter((item) => item.section === 'sgx')
    );
    const otherNews = sortByDateDesc(
        visibleNews.filter((item) => item.section !== 'sgx')
    );

    return (
        <div className='flex flex-col items-center gap-8 mb-[100px]'>
            <BaseTitle
                title='NEWS & PRESS RELEASES'
                className='!text-center futura-condensed-medium hidden'
            />

            {otherNews.length > 0 && (
                <>
                    <BaseTitle
                        title='NEWS'
                        className='!text-center futura-condensed-medium'
                    />
                    <NewsCardGrid items={otherNews} />
                </>
            )}

            {sgxNews.length > 0 && (
                <>
                    <BaseTitle
                        title='SGX OFFICIAL ANNOUNCEMENTS'
                        className='!text-center futura-condensed-medium'
                    />
                    <NewsCardGrid items={sgxNews} />
                </>
            )}
        </div>
    );
};

export default NewsList;
