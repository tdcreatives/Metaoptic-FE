'use client';

import React from 'react';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseButton from '@/components/BaseButton';

import { useRouter } from 'next/navigation';

import data from '@/constants/news.json';

const News = () => {
    const router = useRouter();

    return (
        <div className='xl:py-[10vh] py-[48px] bg-[#ebebeb]'>
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium text-center'>
                NEWS & STORIES
            </h2>

            <div className='xl:p-16 p-8 grid xl:grid-cols-4 grid-cols-1 gap-4'>
                {data.news.map((news, index) => (
                    <BaseNewsCard key={index} news={news} />
                ))}
            </div>

            <BaseButton
                label='View all news'
                classNameBtn='uppercase'
                className='mb-0'
                onClick={() => {
                    router.push('/news');
                }}
            />
        </div>
    );
};

export default News;
