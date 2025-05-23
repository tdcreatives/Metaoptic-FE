'use client';

import React from 'react';
import data from '@/constants/news.json';
import BaseNewsCard from '@/components/BaseNewsCard';
import BaseTitle from '@/components/BaseTitle';

const NewsList = () => {
    const filteredNews = data.news;

    return (
        <div className='flex flex-col items-center gap-8'>
            <BaseTitle
                title='NEWS & PRESS RELEASES'
                className='!text-center futura-condensed-medium'
            />

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:gap-6 gap-5 w-full max-w-6xl mt-8 mb-[100px] xl:px-0 xl:px-10 px-6'>
                {filteredNews.map((news, index) => (
                    <div
                        key={news.id}
                        className={`${index % 3 === 1 ? 'xl:mt-[100px]' : ''}`}>
                        <BaseNewsCard news={news} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsList;
