import React from 'react';
import Image from 'next/image';

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

export default PressReleaseCard;
