'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const BaseNewsCard = ({ news, className = '' }) => {
    const router = useRouter();

    const handleClick = () => {
        console.log(news.external);
        if (news.external) {
            window.open(news.path, '_blank');
        } else {
            router.push(`/news/${news.slug}`);
        }
    };
    return (
        <div
            className={`flex flex-col gap-5 cursor-pointer hover:transform hover:scale-105 transition-transform transition-duration-300 ${className}`}
            onClick={handleClick}>
            <Image
                width={0}
                height={0}
                sizes='100vw'
                className='w-full cursor-pointer h-[250px] rounded-[20px]'
                src={`/${news?.image}`}
                alt='News'
            />

            <div className='flex flex-col gap-3'>
                <div className='text-[12px] text-[#d34c39] uppercase'>{news.date}</div>

                <div className='xl:text-[28px] text-[20px] futura-condensed-medium'>
                    <a href={`${news.path}`} target={news.external ? '_blank' : '_self'}>
                        {news.title}
                    </a>
                </div>
            </div>

            <div>{news.desc}</div>
        </div>
    );
};

export default BaseNewsCard;
