'use client';

import BaseCarousel from '@/components/BaseCarousel';
import Image from 'next/image';

const NewsDetailsBanner = ({ news = {} }) => {
    return (
        <div className='flex flex-col gap-5 mt-12 my-[100px]'>
            <div className='xl:text-[20px] text-[#D44C39] text-[16px]'>{news?.date}</div>

            <div className='xl:text-[40px] text-[28px]'>{news?.title}</div>
            {news?.details?.images && news?.details?.images.length > 0 && (
                news?.details?.images.length > 1 ? (
                    <BaseCarousel images={news?.details?.images || []} />
                ) : (
                    <div className='relative xl:w-[70%] mt-10 max-w-[1200px] mx-auto w-full'>
                        <div className='w-full aspect-[16/9] relative'>
                            <Image 
                                src={`${news?.details?.images[0]}`} 
                                alt={news?.title} 
                                fill 
                                className='object-contain rounded-lg'
                                priority
                            /> 
                        </div>
                    </div>                    
                )
            )}
        </div>
    );
};

export default NewsDetailsBanner;
