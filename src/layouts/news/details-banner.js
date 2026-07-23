'use client';

import BaseCarousel from '@/components/BaseCarousel';
import Image from 'next/image';

// ponytail: press releases often omit details.images — fall back to card image / company logo
const LOGO_FALLBACK = '/news/MOT.webp';

const resolveImages = (news = {}) => {
    const detailImages = news?.details?.images;
    if (detailImages?.length) return detailImages;
    if (news?.image) return [news.image];
    return [LOGO_FALLBACK];
};

const NewsDetailsBanner = ({ news = {} }) => {
    const images = resolveImages(news);

    return (
        <div className='flex flex-col gap-5 mt-12 my-[100px]'>
            <div className='xl:text-[20px] text-[#D44C39] text-[16px]'>{news?.date}</div>

            <div className='xl:text-[40px] text-[28px]'>{news?.title}</div>
            {images.length > 1 ? (
                <BaseCarousel images={images} />
            ) : (
                <div className='relative xl:w-[70%] mt-10 max-w-[1200px] mx-auto w-full'>
                    <div className='w-full aspect-[16/9] relative'>
                        <Image
                            src={`${images[0]}`}
                            alt={news?.title || 'MetaOptics'}
                            fill
                            className='object-contain rounded-lg'
                            priority
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsDetailsBanner;
