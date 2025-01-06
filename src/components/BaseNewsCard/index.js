'use client';

import React from 'react';
import Image from 'next/image';

const BaseNewsCard = ({ news }) => {
    return (
        <div className='flex flex-col gap-5 cursor-pointer hover:transform hover:scale-105 transition-transform transition-duration-300'>
            <a href={`${news.path}`} target={news.external ? '_blank' : '_self'}>
                <Image
                width={0}
                height={0}
                sizes='100vw'
                className='w-full cursor-pointer h-[250px]'
                    src={`/${news?.image}`}
                    alt='News'
                />
            </a>

            <div className='flex flex-col gap-3'>
                <div className='text-[12px] text-[#d34c39] uppercase'>{news.date}</div>

                <div className='text-[20px] futura-medium'>
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
