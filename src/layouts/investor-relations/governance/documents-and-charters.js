import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const MOCK_DOCUMENTS = [
    { id: 'd-1', title: 'Audit Committee Charter', url: '#' },
    { id: 'd-2', title: 'Nominating Committee Charter', url: '#' },
    { id: 'd-3', title: 'Remuneration Committee Charter', url: '#' },
    { id: 'd-4', title: 'Code of Business Conduct and Ethics', url: '#' },
    { id: 'd-5', title: 'Corporate Governance Guidelines', url: '#' },
    { id: 'd-6', title: 'Insider Trading Policy', url: '#' },
];

const DocumentRow = ({ document }) => (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 px-6 py-[33px] border-b border-[#E0E1E0]'>
        <a
            href={document.url}
            target={document.url && document.url !== '#' ? '_blank' : undefined}
            rel={document.url && document.url !== '#' ? 'noopener noreferrer' : undefined}
            className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#231F20] underline underline-offset-4'
        >
            {document.title}
        </a>
        <a
            href={document.url}
            target={document.url && document.url !== '#' ? '_blank' : undefined}
            rel={document.url && document.url !== '#' ? 'noopener noreferrer' : undefined}
            className='inline-block self-start md:self-auto bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 py-5 rounded-full transition-colors leading-none whitespace-nowrap'
        >
            Download PDF
        </a>
    </div>
);

const DocumentsAndCharters = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Documents & Charters
            </h2>

            <div className='mt-6 md:mt-8 lg:mt-10'>
                {MOCK_DOCUMENTS.map((doc) => (
                    <DocumentRow key={doc.id} document={doc} />
                ))}
            </div>
        </IRContainer>
    );
};

export default DocumentsAndCharters;
