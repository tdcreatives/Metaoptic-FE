'use client';

import React from 'react';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseButton from '@/components/BaseButton';

import { useRouter } from 'next/navigation';

const newsItems = [
    {
        title: 'MetaOptics coming to CES 2025 in Las Vegas',
        desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
        date: 'January 15, 2025',
        image: 'news-1.jpg',
        path: 'https://drive.google.com/file/d/1hNlMexABvVbvIh8IM3xZcrR4Qvv4jfqS/view',
        external: true,
    },
    // {
    //     title: 'Pico Projector using MEMS laser scanner',
    //     desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
    //     date: 'January 15, 2025',
    //     image: 'news-2.jpg',
    // },
    // {
    //     title: 'All about meta-tech you need to know',
    //     desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
    //     date: 'January 15, 2025',
    //     image: 'news-3.jpg',
    // },
    // {
    //     title: 'MetaOptics coming to CES 2025 in Las Vegas',
    //     desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
    //     date: 'January 15, 2025',
    //     image: 'news-4.jpg',
    // },
];

const News = () => {
    const router = useRouter();

    return (
        <div className='xl:py-[10vh] py-[48px] bg-[#ebebeb]'>
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium text-center'>
                NEWS & STORIES
            </h2>

            <div className='xl:p-16 p-8 grid xl:grid-cols-4 grid-cols-1 gap-4'>
                {newsItems.map((news, index) => (
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
