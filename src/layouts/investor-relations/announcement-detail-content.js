'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import items from '@/constants/announcements.json';

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
        <div className='px-4 md:px-8 lg:px-16 xl:px-[199px] py-8'>

            <div className='mb-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-[48px] font-medium uppercase futura-condensed-medium text-[#111111] leading-[1.5]'>
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
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Issuer/Manager */}
                        <div className='flex gap-4'>
                            <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                Issuer/ Manager:
                            </div>
                            <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.55]'>
                                {details.issuer.name}
                            </div>
                        </div>

                        {/* Securities */}
                        <div className='flex gap-4'>
                            <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                Securities:
                            </div>
                            <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.55]'>
                                {details.securities.name}
                            </div>
                        </div>
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
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {/* Left Column */}
                            <div className='space-y-6'>
                                {/* Announcement Sub Title */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Announcement Sub Title:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.subTitle}
                                    </div>
                                </div>

                                {/* Announcement Title */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Announcement Title:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.title}
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Date &Time of Broadcast:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.dateTime}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Status:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.status}
                                    </div>
                                </div>

                                {/* Announcement Reference */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Announcement Reference:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.reference}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className='space-y-6'>
                                {/* Submitted By */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5] min-w-[200px]'>
                                        Submitted By (Co./ Ind. Name):
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.submittedBy}
                                    </div>
                                </div>

                                {/* Designation */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#6B6B6B] leading-[1.5] min-w-[200px]'>
                                        Designation:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.designation}
                                    </div>
                                </div>

                                {/* Effective Start Date */}
                                <div className='flex gap-4'>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[#6B6B6B] leading-[1.5] min-w-[200px]'>
                                        Effective Start Date of the Event:
                                    </div>
                                    <div className='text-[20px] font-medium futura-condensed-medium text-[rgba(17,17,17,0.9)] leading-[1.55]'>
                                        {details.announcement.effectiveStartDate}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className='mt-8'>
                            <div className='mb-4'>
                                <h3 className='text-[20px] font-medium futura-condensed-medium text-[#111111] leading-[1.5]'>
                                    Description (Please provide a detailed description of the event in the box below):
                                </h3>
                            </div>
                            <div className=''>
                                <div className='text-[20px] font-medium futura-condensed-medium text-[#676767] leading-[1] whitespace-pre-line'>
                                    {details.announcement.description}
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-[2px] bg-[#a9a9a9] opacity-50'></div>
                        {/** DISCLAIMER */}
                        <div className='mt-8'>
                            <div className='mb-4 text-[20px] font-medium futura-condensed-medium text-[#676767] leading-[1] whitespace-pre-line'>
                                DISCLAIMER:  {details.announcement.disclaimer}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div></div>
    );
};

export default AnnouncementDetailContent;
