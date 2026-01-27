'use client';

import React, { useEffect, useCallback, useState } from 'react';
import './index.css';
import Image from 'next/image';
import { gsap } from 'gsap';
import HeroTitle from '@/layouts/privacy-policy/hero-title';




const Content = () => {
    // Track expanded state for each section individually
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        const sections = document.querySelectorAll('.spec-section');
        gsap.fromTo(
            sections,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const toggleSection = (sectionKey) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionKey]: !(prev[sectionKey] ?? true) // Default to true if not set
        }));
    };

    // Privacy Policy sections
    const privacyPolicySections = [
        {
            title: 'Introduction',
            content: `MetaOptics Ltd. ("MetaOptics", "we", "us", or "our") respects the privacy of our customers, business partners, and visitors. This Privacy Policy outlines how we collect, use, disclose, and protect your personal data in compliance with the Singapore Personal Data Protection Act 2012 (PDPA) and other applicable laws.`,
        },
        {
            title: 'Information We Collect',
            content: `We may collect personal information that is necessary for our business operations, including but not limited to:

• Identity Data: Name, job title, and company details.
• Contact Data: Email address, mailing address, and telephone numbers.
• Technical Data: IP address, browser type, and operating system when you visit our website.
• Business Data: Information provided during the course of contractual or commercial engagements regarding our metalens products and manufacturing services.
`,
        },
        {
            title: 'How We Use Information',
            content: `We use your personal data for the following purposes:

• To facilitate business transactions, operational queries, and manufacturing orders.
• To respond to your inquiries submitted via our "Contact Us" forms.
• To send administrative information, such as changes to our terms, conditions, and policies.
• To comply with legal and regulatory obligations.`,
        },
        {
            title: 'Disclosure of Information',
            content: `MetaOptics does not sell your personal data. We may disclose your data only:

• To our subsidiaries and affiliates (e.g., MetaOptics US) for internal administrative purposes.
• To third-party service providers (e.g., IT support, logistics) who process data on our behalf under strict confidentiality agreements.
• When required by law or to protect the rights and safety of MetaOptics and its stakeholders.`,
        },
        {
            title: 'Data Security',
            content: `We implement appropriate administrative, physical, and technical measures to safeguard your personal data against unauthorized access, misuse, disclosure, or alteration.`,
        },
    ];

    // Whistleblowing Policy sections
    const whistleblowingPolicySections = [
        {
            title: 'Commitment to Integrity',
            content: `MetaOptics is committed to maintaining a high standard of corporate governance, transparency, and ethical conduct. We have established a Whistleblowing Policy to provide a safe and confidential channel for employees, external parties, and other stakeholders to report concerns regarding improprieties or misconduct.`,
        },
        {
            title: 'Scope of Reporting',
            content: `Whistleblowers may report concerns relating to, but not limited to:

• Fraud, corruption, or bribery.
• Breach of legal or regulatory obligations.
• Misconduct in financial reporting.
• Unethical business conduct or conflicts of interest.
• Health and safety violations.`,
        },
        {
            title: 'Confidentiality & Protection',
            content: `We take all reports seriously and treat them with the strictest confidentiality.

• Identity Protection: The identity of the whistleblower will be kept confidential to the extent possible, consistent with the need to conduct a thorough investigation and subject to legal requirements.
• Non-Retaliation: MetaOptics does not tolerate retaliation against any individual who reports a concern in good faith.`,
        },
        {
            title: 'How to Report',
            content: `To ensure independence, reports can be directed to our dedicated channel:

• Email: <a href="mailto:ethics@metaoptics.sg" class="text-[#D34C39] hover:underline">ethics@metaoptics.sg</a>

Please provide as much detail as possible (e.g., names, dates, nature of the incident) to facilitate an effective investigation. 
All reports are reviewed by the Audit Committee or designated independent personnel.`,
        }
    ];


    const renderSection = (section, index, sectionKey) => {
        const isExpanded = expandedSections[sectionKey] ?? true; // Default to expanded
        
        return (
            <div key={index} className='mb-8 print:break-inside-avoid spec-section'>
                <div className='mb-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-[22px] lg:text-[40px] font-medium uppercase futura-condensed-medium text-[#D34C39] xl:leading-[1.5] leading-[17px]'>
                            {section.title}
                        </h2>
                        <div
                            className={`transition-transform duration-300 ${
                                !isExpanded ? 'rotate-180' : ''
                            }`}
                            onClick={() => toggleSection(sectionKey)}>
                            <Image
                                src='/product-details/up.svg'
                                alt='Expand/Collapse'
                                width={0}
                                height={0}
                                className='cursor-pointer w-7 h-7 object-contain'
                            />
                        </div>
                    </div>
                    <div className='w-full h-[2px] bg-[#A9A9A9] opacity-50'></div>
                </div>
                {/* Collapsible Content */}
                <div
                    className={`overflow-hidden transition-all duration-500 ${
                        isExpanded
                            ? 'max-h-[5000px] opacity-100'
                            : 'max-h-0 opacity-0'
                    }`}>
                    <div 
                        className='text-[14px] lg:text-[20px] font-medium text-[#111111] xl:leading-[1.5] leading-[17px] whitespace-pre-line'
                        dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
        <HeroTitle title='Privacy Policy' subtitle='' />
        <div className='privacy-policy-content'>
            <div className='w-full bg-[#EAEAEA] rounded-t-lg px-6 py-8'>
                <div className='px-2 md:px-4 lg:px-8 xl:px-[99px] py-8'>
                    {/* Privacy Policy Section */}
                    <div className='mb-12'>
                        {privacyPolicySections.map((section, index) => 
                            renderSection(section, index, `privacy-${index}`)
                        )}
                    </div>
                </div>
            </div>
        </div>
        <HeroTitle title='WHISTLEBLOWING POLICY' subtitle='' />

        <div className='privacy-policy-content'>
            <div className='w-full bg-[#EAEAEA] rounded-t-lg px-6 py-8'>
                <div className='px-2 md:px-4 lg:px-8 xl:px-[99px] py-8'>
                    {/* Whistleblowing Policy Section */}
                    <div className='mb-12'>
                        {whistleblowingPolicySections.map((section, index) => 
                            renderSection(section, index, `whistleblowing-${index}`)
                        )}
                    </div>

                </div>
            </div>
        </div>
        </>
    );
};

export default Content;
