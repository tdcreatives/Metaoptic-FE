'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchPressReleaseList, fetchPressReleaseExcerpt } from '@/lib/b2i';

const PressReleaseCard = ({ item }) => (
    <a
        href={item.storyUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='flex flex-col gap-5 group'
    >
        <div className='w-full xl:h-[250px] h-[200px] bg-white flex items-center justify-center border border-[#EEE] overflow-hidden'>
            <Image
                src='/logo.svg'
                alt='Metaoptics'
                width={220}
                height={70}
                className='opacity-90 transition-transform duration-300 group-hover:scale-105'
            />
        </div>
        <div className='text-[12px] text-[#d34c39] uppercase tracking-wider'>{item.dateFormatted}</div>
        <div className='xl:text-[24px] text-[20px] futura-condensed-medium leading-snug text-black group-hover:text-[#d34c39] transition-colors'>
            {item.title}
        </div>
        {item.desc && (
            <div className='futura-medium text-[14px] xl:text-[16px] text-black/80 leading-[1.6]'>
                {item.desc}
            </div>
        )}
    </a>
);

const RecentPressReleases = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
        const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;
        const count = Number(process.env.NEXT_PUBLIC_B2I_COUNT || 3);

        let cancelled = false;

        (async () => {
            const list = await fetchPressReleaseList({ bizId, apiKey, count });
            if (cancelled) return;
            setItems(list.map((it) => ({ ...it, desc: '' })));

            const withDescs = await Promise.all(
                list.map(async (it) => ({
                    ...it,
                    desc: await fetchPressReleaseExcerpt({ storyUrl: it.storyUrl }),
                }))
            );
            if (cancelled) return;
            setItems(withDescs);
        })();

        return () => { cancelled = true; };
    }, []);

    return (
        <section className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Recent Press Releases
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-[60px] mt-8 md:mt-10 lg:mt-12'>
                {items.map((item) => (
                    <PressReleaseCard key={item.id} item={item} />
                ))}
            </div>

            <div className='flex justify-center mt-10 md:mt-12 lg:mt-14'>
                <Link
                    href='/investor-relations/news/press-releases'
                    className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
                >
                    View All Press Release
                </Link>
            </div>
        </section>
    );
};

export default RecentPressReleases;
