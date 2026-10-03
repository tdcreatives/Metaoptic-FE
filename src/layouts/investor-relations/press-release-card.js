import React from 'react';

const PressReleaseCard = ({ item }) => (
    <a
        href={item.storyUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='flex flex-col gap-5 cursor-pointer group'
    >
        <div className='flex flex-col gap-3'>
            <div className='text-[12px] text-[#d34c39] uppercase'>{item.dateFormatted}</div>
            <div className='xl:text-[28px] text-[24px] futura-condensed-medium text-black group-hover:text-[#d34c39] transition-colors'>
                {item.title}
            </div>
        </div>

        {item.desc && (
            <div className='line-clamp-2 futura-medium font-medium text-[14px] md:text-[16px] text-[#231F20] leading-[1.5]'>
                {item.desc}
            </div>
        )}
    </a>
);

export default PressReleaseCard;
