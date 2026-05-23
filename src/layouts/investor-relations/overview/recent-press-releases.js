'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPressReleaseList, fetchPressReleaseExcerpt } from '@/lib/b2i';
import PressReleaseCard from '@/layouts/investor-relations/press-release-card';

const RecentPressReleases = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
        const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;
        const count = 3;

        let cancelled = false;

        (async () => {
            const { items: list } = await fetchPressReleaseList({ bizId, apiKey, count });
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
