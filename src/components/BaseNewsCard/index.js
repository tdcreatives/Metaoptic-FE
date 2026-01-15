'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const BaseNewsCard = ({ news, className = '' }) => {
    const thumbImage = news.thumbnail || news.image;
    const newsUrl = news.external ? news.path : `/news/${news.slug}`;
    
    const CardContent = () => (
        <>
            <motion.div
                className='w-full cursor-pointer xl:h-[250px] h-[200px] rounded-[20px]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}>
                <Image
                    width={0}
                    height={0}
                    sizes='100vw'
                    src={`${thumbImage}`}
                    alt='News'
                    className='w-full h-full object-cover rounded-[20px]'
                />
            </motion.div>

            <div className='flex flex-col gap-3 xl:text-start text-center'>
                <div className='text-[12px] text-[#d34c39] uppercase'>{news.date}</div>

                <div className='xl:text-[28px] text-[24px] futura-condensed-medium xl:text-start text-center'>
                    {news.title}
                </div>
            </div>

            <div className='xl:text-start text-center'>{news.desc}</div>
        </>
    );

    return news.external ? (
        <a
            href={newsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col gap-5 cursor-pointer ${className}`}>
            <CardContent />
        </a>
    ) : (
        <Link
            href={newsUrl}
            className={`flex flex-col gap-5 cursor-pointer ${className}`}>
            <CardContent />
        </Link>
    );
};

export default BaseNewsCard;
