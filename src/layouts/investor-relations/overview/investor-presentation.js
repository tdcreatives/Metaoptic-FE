import React from 'react';
import { IconCircleArrowDown } from '@tabler/icons-react';

const InvestorPresentation = () => {
    const fileLabel = 'MetaOptics - Investor Presentation.pdf';
    const downloadUrl = 'https://www.google.com';

    return (
        <section className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Investor Presentation
            </h2>

            <a
                href={downloadUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-3 mt-6 md:mt-8 lg:mt-10 group w-fit'
            >
                <IconCircleArrowDown size={28} strokeWidth={1.5} className='text-black shrink-0' />
                <span className='futura-medium text-[16px] md:text-[18px] xl:text-[20px] font-medium text-[#231F20] group-hover:text-[#d34c39] transition-colors'>
                    {fileLabel}
                </span>
            </a>

            <div className='mt-6 md:mt-8'>
                <a
                    href={downloadUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
                >
                    Download PDF
                </a>
            </div>
        </section>
    );
};

export default InvestorPresentation;
