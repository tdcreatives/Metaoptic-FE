import React from 'react';

const PersonRow = ({ person }) => (
    <div className='flex flex-col lg:flex-row items-start gap-8 md:gap-12 xl:gap-[56px] px-4 md:px-8 xl:px-16 py-10 md:py-12 lg:py-14 border-b border-[#E0E1E0]'>
        <div className='flex-1 min-w-0'>
            <h3 className='futura-condensed-medium font-medium text-[24px] md:text-[28px] xl:text-[32px] text-[#231F20]'>
                {person.name}
            </h3>
            <div className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#d34c39] mt-2 md:mt-3'>
                {person.title}
            </div>

            <div className='flex flex-col gap-4 md:gap-5 mt-5 md:mt-6'>
                {(person.bio || []).map((paragraph, idx) => (
                    <p
                        key={idx}
                        className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[18px] text-[#231F20] leading-[1.6]'
                    >
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    </div>
);

export default PersonRow;
