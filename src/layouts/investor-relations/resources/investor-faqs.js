'use client';

import React, { useMemo, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import IRContainer from '@/layouts/investor-relations/container';
import data from '@/constants/investor-faqs.json';

const URL_RE = /(https?:\/\/[^\s]+)/g;

const renderRichText = (text = '') => {
    const parts = String(text).split(URL_RE);
    return parts.map((part, index) => {
        if (/^https?:\/\//.test(part)) {
            const href = part.replace(/[.,)]+$/, '');
            const trailing = part.slice(href.length);
            return (
                <React.Fragment key={`${href}-${index}`}>
                    <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-[#d34c39] underline break-all'
                    >
                        {href}
                    </a>
                    {trailing}
                </React.Fragment>
            );
        }
        return <React.Fragment key={`t-${index}`}>{part}</React.Fragment>;
    });
};

const FAQAnswer = ({ faq }) => (
    <div className='pb-6 md:pb-7 pr-10 futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888] leading-[1.6] whitespace-pre-line'>
        {renderRichText(faq.answer)}
        {Array.isArray(faq.list) && faq.list.length > 0 && (
            <ul className='mt-4 list-disc pl-5 space-y-2'>
                {faq.list.map((item, index) => (
                    <li key={index}>{renderRichText(item)}</li>
                ))}
            </ul>
        )}
    </div>
);

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
        {isOpen && <FAQAnswer faq={faq} />}
    </div>
);

const InvestorFAQs = () => {
    const sections = useMemo(() => {
        if (Array.isArray(data.sections) && data.sections.length > 0) return data.sections;
        // ponytail: keep old flat `faqs` shape working if JSON is rolled back
        return [{ id: 'all', title: '', faqs: data.faqs || [] }];
    }, []);

    const firstFaqId = sections[0]?.faqs?.[0]?.id;
    const [openIds, setOpenIds] = useState(firstFaqId ? [firstFaqId] : []);

    const toggle = (id) => {
        setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const hasFaqs = sections.some((section) => (section.faqs || []).length > 0);

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-2 md:pb-2.5 lg:pb-3'>
                Investor FAQs
            </h2>

            {!hasFaqs ? (
                <div className='mt-12 md:mt-16 lg:mt-20 py-12 text-center text-[#888888] futura-medium'>
                    No FAQs available.
                </div>
            ) : (
                // ponytail: spacing tuned to IR FAQ PDF — ~84px after page title,
                // ~44px section title → first Q, ~100px between sections
                <div className='mt-12 md:mt-16 lg:mt-20 space-y-16 md:space-y-20 lg:space-y-24'>
                    {sections.map((section) => (
                        <section key={section.id}>
                            {section.title ? (
                                <h3 className='futura-condensed-medium font-medium text-black uppercase text-[24px] md:text-[28px] xl:text-[36px] leading-tight mb-6 md:mb-8 lg:mb-10'>
                                    {section.title}
                                </h3>
                            ) : null}
                            <div>
                                {(section.faqs || []).map((faq) => (
                                    <FAQItem
                                        key={faq.id}
                                        faq={faq}
                                        isOpen={openIds.includes(faq.id)}
                                        onToggle={() => toggle(faq.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </IRContainer>
    );
};

export default InvestorFAQs;
