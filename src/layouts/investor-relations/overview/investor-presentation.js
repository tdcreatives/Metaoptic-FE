import React from 'react';
import { IconCircleArrowDown } from '@tabler/icons-react';
import IRContainer from '@/layouts/investor-relations/container';
import clsx from 'clsx';

const DEFAULT_DOCUMENTS = [
    {
        label: 'MetaOptics - Investor Presentation.pdf',
        url: 'https://www.metaoptics.sg/download/MOT-Company-Presentation-May2026-FINAL.pdf',
    },
];

const DocumentCard = ({ document }) => (
    <div className='flex flex-col h-full'>
        <a
            href={document.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-start gap-3 group flex-1'
        >
            <IconCircleArrowDown size={28} strokeWidth={1.5} className='text-black shrink-0 mt-0.5' />
            <span className='futura-medium text-[16px] md:text-[18px] xl:text-[20px] font-medium text-[#231F20] group-hover:text-[#d34c39] transition-colors leading-snug'>
                {document.label}
            </span>
        </a>

        <div className='mt-5 md:mt-6'>
            <a
                href={document.url}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
            >
                Download PDF
            </a>
        </div>
    </div>
);

const InvestorPresentation = ({
    title = 'Investor Presentation',
    documents = DEFAULT_DOCUMENTS,
    columns = 1,
}) => {
    const useThreeColumnGrid = columns === 3;

    return (
        <IRContainer id='investor-presentation' className='py-12 md:py-16 lg:py-20 xl:pt-[60px] scroll-mt-24'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                {title}
            </h2>

            <div
                className={clsx(
                    'mt-8 md:mt-10 lg:mt-12',
                    useThreeColumnGrid
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-[60px]'
                        : 'flex flex-col gap-8 md:gap-10'
                )}
            >
                {documents.map((document) => (
                    <DocumentCard key={document.url} document={document} />
                ))}
            </div>
        </IRContainer>
    );
};

export default InvestorPresentation;
