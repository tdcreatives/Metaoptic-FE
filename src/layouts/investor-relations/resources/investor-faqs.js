'use client';

import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import IRContainer from '@/layouts/investor-relations/container';
import data from '@/constants/investor-faqs.json';

const FAQItem = ({ faq, isOpen, onToggle }) => (
    <div className='border-b border-[#E0E1E0]'>
        <button
            type='button'
            onClick={onToggle}
            aria-expanded={isOpen}
            className='flex items-center justify-between w-full gap-4 py-6 md:py-7 text-left'
        >
            <span className='futura-medium font-medium text-[16px] md:text-[20px] xl:text-[24px] text-[#231F20]'>
                {faq.question}
            </span>
            <IconChevronDown
                size={24}
                className={`shrink-0 text-[#d34c39] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
        </button>
        {isOpen && (
            <div className='pb-6 md:pb-7 pr-10 futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888] leading-[1.6]'>
                {faq.answer}
            </div>
        )}
    </div>
);

const InvestorFAQs = () => {
    const faqs = data.faqs || [];
    const [openIds, setOpenIds] = useState(faqs.length > 0 ? [faqs[0].id] : []);

    const toggle = (id) => {
        setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Investor FAQs
            </h2>

            <div className='mt-6 md:mt-8'>
                {faqs.length === 0 ? (
                    <div className='py-12 text-center text-[#888888] futura-medium'>No FAQs available.</div>
                ) : (
                    faqs.map((faq) => (
                        <FAQItem
                            key={faq.id}
                            faq={faq}
                            isOpen={openIds.includes(faq.id)}
                            onToggle={() => toggle(faq.id)}
                        />
                    ))
                )}
            </div>
        </IRContainer>
    );
};

export default InvestorFAQs;
