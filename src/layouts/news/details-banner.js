'use client';

import BaseCarousel from '@/components/BaseCarousel';

const NewsDetailsBanner = ({ news = {} }) => {
    return (
        <div className='flex flex-col gap-5 mt-12 my-[100px]'>
            <div className='xl:text-[20px] text-[#D44C39] text-[16px]'>{news?.date}</div>

            <div className='xl:text-[40px] text-[28px]'>{news?.title}</div>

            <BaseCarousel images={news?.details?.images || []} />
        </div>
    );
};

export default NewsDetailsBanner;
