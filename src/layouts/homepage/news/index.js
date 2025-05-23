'use client';

import React from 'react';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseButton from '@/components/BaseButton';
import BaseTitle from '@/components/BaseTitle';

import { useRouter } from 'next/navigation';

import data from '@/constants/news.json';

const News = () => {
    const router = useRouter();

    return (
        <div className='xl:py-[24px] py-[16px] bg-[#ebebeb]'>
            <BaseTitle
                title='NEWS & PRESS RELEASES'
                className='futura-condensed-medium !text-center'
            />

            <div className='xl:px-16 xl:py-8 px-8 py-4 grid xl:grid-cols-4 grid-cols-1 gap-4'>
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
