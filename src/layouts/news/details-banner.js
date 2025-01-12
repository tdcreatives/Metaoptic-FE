'use client';

import BaseCarousel from '@/components/BaseCarousel';

const NewsDetailsBanner = ({ news = {} }) => {
    return (
        <div className='flex flex-col gap-5 mt-12 my-[100px]'>
            <div className='xl:text-[24px] text-[#D44C39] text-[18px]'>{news?.date}</div>

            <div className='xl:text-[64px] text-[40px]'>{news?.title}</div>

            <BaseCarousel images={news?.details?.images || []} />
        </div>
    );
};

export default NewsDetailsBanner;
