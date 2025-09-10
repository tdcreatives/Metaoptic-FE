'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import items from '@/constants/announcements.json';
import BaseButton from '@/components/BaseButton';
import downloadIcon from '@/assets/images/download.png';
import Image from 'next/image';

const AnnouncementDetailContent = () => {
    const { slug } = useParams();
    const [expandedSections, setExpandedSections] = useState({
        issuer: true,
        announcement: true
    });

    const announcement = items.find((item) => item.slug === slug);

    if (!announcement || !announcement.details) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[400px]'>
                <h1 className='text-4xl font-semibold text-red-500 mb-4'>Announcement Not Found</h1>
                <p className='text-gray-600'>The requested announcement could not be found.</p>
            </div>
        );
    }

    const { details } = announcement;

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className='w-full bg-[#EAEAEA] rounded-t-lg px-6 py-8'>
            {/* Header Section */}
            <div className='px-2 md:px-4 lg:px-8 xl:px-[99px] py-8'>

                <div className='mb-8'>
                    <div className='flex justify-between items-center mb-4 text-wrap'>
                        <h1 className='text-[48px] font-medium uppercase futura-condensed-medium text-[#111111] leading-[1.5] wrap-anywhere'>
                            {announcement.title}
                        </h1>
                    </div>
                    <div className='w-full h-[2px] bg-[#111111] opacity-50'></div>
                </div>

                {/* Issuer & Securities Section */}
                <div className='mb-8'>
                    <div className='mb-6'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-[48px] font-medium uppercase futura-condensed-medium text-[#616161] leading-[1.5]'>
                                Issuer & Securities
                            </h2>
                        </div>
                        <div className='w-full h-[2px] bg-[#A9A9A9] opacity-50'></div>
                    </div>

                    {expandedSections.issuer && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Issuer/Manager */}
                            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                                <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                    Issuer/ Manager:
                                </div>
                                <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                    {details.issuer.name}
                                </div>
                            </div>
                        
                            {/* Securities */}
                            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                                <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                    Securities:
                                </div>
                                <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                    {details.securities.name}
                                </div>
                            </div>
                        
                            {/* Stapled Security */}
                            {details?.stapledSecurity?.name && (
                                <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                                    <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                        Stapled Security:
                                    </div>
                                    <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                        {details.stapledSecurity.name}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Announcement Details Section */}
                <div className='mb-8'>
                    <div className='mb-6'>
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-[48px] font-medium uppercase futura-condensed-medium text-[#616161] leading-[1.5]'>
                                Announcement Details
                            </h2>
                        </div>
                        <div className='w-full h-[2px] bg-[#A9A9A9] opacity-50'></div>
                    </div>

                    {expandedSections.announcement && (
                        <div className='space-y-8'>
                            {/* Announcement Details Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {/* Left Column */}
                                <div className='space-y-6'>
                                    {/* Announcement Title */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Announcement Title:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.title}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Status:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.status}
                                        </div>
                                    </div>

                                    {/* Announcement Reference */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Announcement Reference:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.reference}
                                        </div>
                                    </div>

                                    {/* Designation */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Designation:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.designation}
                                        </div>
                                    </div>                    
                                </div>

                                {/* Right Column */}
                                <div className='space-y-6'>
                                    {/* Date & Time */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Date &Time of Broadcast:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.dateTime}
                                        </div>
                                    </div>

                                    {/* Announcement Sub Title */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Announcement Sub Title:
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.subTitle}
                                        </div>
                                    </div>

                                    {/* Submitted By */}
                                    <div className='flex flex-col md:flex-row gap-4'>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                            Submitted By (Co./ Ind. Name):
                                        </div>
                                        <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                            {details.announcement.submittedBy}
                                        </div>
                                    </div>
                                    
                                    {/* Effective Start Date */}
                                    {details?.announcement?.effectiveStartDate && (
                                        <div className='flex flex-col md:flex-row gap-4'>
                                            <div className='text-[20px] font-medium text-[#111111] leading-[1.5] w-[200px] flex-shrink-0'>
                                                Effective Start Date of the Event:
                                            </div>
                                            <div className='text-[20px] font-medium text-[#111111] leading-[1.55] flex-grow'>
                                                {details.announcement.effectiveStartDate}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='w-full h-[2px] bg-[#a9a9a9] opacity-50'></div>

                            {/* Description Section */}
                            <div className='mt-8'>
                                <div className='mb-4'>
                                    <h3 className='text-[20px] font-medium text-[#111111] leading-[1.5]'>
                                        Description (Please provide a detailed description of the event in the box below):
                                    </h3>
                                </div>
                                <div className=''>
                                    <div className='text-[20px] font-medium text-[#676767] leading-[1] whitespace-pre-line'>
                                        {details.announcement.description}
                                    </div>
                                </div>
                            </div>
                            <div className='w-full h-[2px] bg-[#a9a9a9] opacity-50'></div>

                            {/** DISCLAIMER */}
                            {details?.announcement?.disclaimer && (
                                <div className='mt-8'>
                                    <div className='mb-4 text-[20px] font-medium text-[#676767] leading-[1] whitespace-pre-line'>
                                        DISCLAIMER: {details.announcement.disclaimer}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                {details?.attachments && (
                    <div className='mb-8'>
                        <div className='mb-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-[48px] font-medium uppercase futura-condensed-medium text-[#616161] leading-[1.5]'>
                                    Attachments
                                </h2>
                            </div>
                            <div className='w-full h-[2px] bg-[#A9A9A9] opacity-50'></div>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                            {details.attachments.map((item, index) => (
                                <div
                                    key={index}
                                    className='xl:mt-[10px] pb-10'
                                >
                                    {/* Date */}
                                    <div className='flex items-center gap-2 py-2'>
                                        <span className='text-[20px] font-medium text-black leading-[1.2]'><Image src={downloadIcon} alt='arrow' width={32} height={32} /></span>
                                        <span className='text-[20px] font-medium text-black leading-[1.2]'>
                                            {item.name}
                                        </span>                           
                                    </div>

                                    {/* Title Container */}
                                    <BaseButton
                                        label={'Download PDF'}
                                        classNameBtn='uppercase'
                                        bgDefault='#d34c39'
                                        className='!mt-[10px] !xl:justify-start !justify-start'                        
                                        onClick={() => window.open(item?.url, '_blank')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementDetailContent;
