'use client';

import React from 'react';
import BaseNewsCard from '@/app/components/BaseNewsCard';

const newsItems = [
    {
        title: 'MetaOptics coming to CES 2025 in Las Vegas',
        desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
        date: 'January 15, 2025',
        image: 'news-1.png',
    },
    {
        title: 'Pico Projector using MEMS laser scanner',
        desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
        date: 'January 15, 2025',
        image: 'news-2.png',
    },
    {
        title: 'All about meta-tech you need to know',
        desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
        date: 'January 15, 2025',
        image: 'news-3.png',
    },
    {
        title: 'MetaOptics coming to CES 2025 in Las Vegas',
        desc: 'MetaOptics invites attendees to visit Booth 61015-1 to experience these cutting-edge products firsthand and explore its broader portfolio of metalens-powered solutions',
        date: 'January 15, 2025',
        image: 'news-4.png',
    },
];

const News = () => {
    return (
        <div className='xl:py-[10vh] py-[48px] bg-[#ebebeb]'>
            <h2 className='text-[150px] text-[#d34c39] uppercase futura-condensed-medium ml-16 text-center'>
                NEWS & STORIES
            </h2>

            <div className='p-16 grid grid-cols-4 gap-4'>
                {newsItems.map((news, index) => (
                    <BaseNewsCard key={index} news={news} />
                ))}
            </div>

            <div className='flex justify-center mt-10'>
                <button className='bg-[#d34c39] text-white font-bold text-lg px-10 py-3 rounded-full futura-medium tracking-[4px] mt-6 text-[20px]'>
                    VIEW ALL NEWS
                </button>
            </div>
        </div>
    );
};

export default News;
