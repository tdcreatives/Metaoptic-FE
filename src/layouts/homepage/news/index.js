'use client';

import React from 'react';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseButton from '@/components/BaseButton';
import BaseTitle from '@/components/BaseTitle';

import Link from 'next/link';

import data from '@/constants/news.json';

const News = () => {
    // Sort news by date in descending order (newest first) and get latest 4
    const latestNews = [...data.news]
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        })
        .slice(0, 4);

    return (
        <div className='xl:py-[24px] py-[16px] bg-[#ebebeb]'>
            <BaseTitle
                title='NEWS & PRESS RELEASES'
                className='futura-condensed-medium !text-center'
            />

            <div className='xl:px-16 xl:py-8 px-8 py-4 grid xl:grid-cols-4 grid-cols-1 gap-4'>
                {latestNews.map((news, index) => (
                    <BaseNewsCard key={index} news={news} />
                ))}
            </div>

            <Link href="/news">
                <BaseButton
                    label='View all news'
                    classNameBtn='uppercase'
                    className='mb-0'
                />
            </Link>
        </div>
    );
};

export default News;
