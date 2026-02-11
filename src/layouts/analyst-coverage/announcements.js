'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import items from '@/constants/announcements.json';
import firmsData from '@/constants/analyst-coverage-firms.json';
import IconButton from '@/components/IconButton';
import arrowIcon from '@/assets/images/arrow.png';
import arrowMobileIcon from '@/assets/images/arrow-mobile.png';
import Image from 'next/image';
import { truncateString } from '@/utils/index';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        // Set initial value
        setIsMobile(window.innerWidth < 768);
        // Add resize listener
        window.addEventListener('resize', handleResize);
        // Cleanup listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const AnalystCoverageAnnouncements = () => {
    const isMobile = useIsMobile();

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // Controls Firms section visibility

    const toggleAllSections = () => {
        setIsExpanded((prev) => !prev);
    };

    const handlePlay = () => {
        if (videoRef.current) {
        videoRef.current.play().catch((error) => {
            console.error('Video playback failed:', error);
        });
        setIsPlaying(true);
        }
    };

     // Sort news by date in descending order (newest first)
     const filteredItems = [...items].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    return (
        <>            
            <div className='w-full bg-[#EAEAEA] rounded-t-lg px-6 py-8'>
                {/* Header Section */}
                <div className='px-2 md:px-4 lg:px-8 xl:px-[99px] py-8'>

                    

                    <div className='mb-8'>
                        <div className='mb-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <div className='text-[14px] xl:text-[20px] font-medium text-[#676767] xl:leading-[1.5] leading-[20px] whitespace-pre-line text-justify'>
                                    Analysts and media platforms from the following firms follow the progress of MetaOptics Ltd and periodically issue reports or articles, all of which are independent of MetaOptics’ input.
                                    <br />
                                    <br />
                                    It is MetaOptics&apos; policy not to distribute any analyst reports written on our Company. In addition, we do not endorse any analyst&apos;s projections or opinions.
                                </div>
                            </div>
                        </div>

                        
                    </div>
                                       
                    <div className='mb-8'>
                        <div className='mb-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-[20px] lg:text-[40px]  font-medium uppercase futura-condensed-medium text-[#D34C39] leading-[1.5]'>
                                    Firms
                                </h2>
                                <div
                                    className={`transition-transform duration-300 ${
                                        !isExpanded ? 'rotate-180' : ''
                                    }`}
                                    onClick={toggleAllSections}>
                                    <Image
                                        src='/product-details/up-orange.svg'
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
                            {firmsData.firms.map((firm, index) => (
                                <React.Fragment key={firm.id}>
                                    <div className='grid grid-cols-1 gap-12 mb-4 mt-4'>
                                        <div className='flex flex-col md:flex-row gap-4'>
                                            <div className='text-[14px] xl:text-[20px] font-medium text-[#111111] xl:leading-[1.5] leading-[17px] w-[200px] flex-shrink-0'>
                                                {firm.name}
                                            </div>
                                            <div className='text-[14px] xl:text-[20px] font-medium text-[#111111] xl:leading-[1.5] leading-[17px] flex-grow md:text-right'>
                                                {firm.link ? (
                                                    <Link 
                                                        className='text-[#D34C39] underline uppercase' 
                                                        href={firm.link} 
                                                        target='_blank'
                                                    >
                                                        Learn More
                                                    </Link>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    {index < firmsData.firms.length - 1 && (
                                        <div className='w-full h-[2px] bg-[#A9A9A9] opacity-50'></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                    </div>
                    
                    <div className='mb-8'>
                        <div className='mb-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <div className='text-[14px] xl:text-[20px] font-medium italic text-[#676767] xl:leading-[1.5] leading-[20px] whitespace-pre-line text-justify'>

                                    MetaOptics Ltd is followed by the analysts and firms listed above. Please note that any opinions, estimates, 
                                    or forecasts regarding MetaOptics Ltd&apos;s performance made by these analysts are theirs alone and do not represent opinions, 
                                    forecasts, or predictions of MetaOptics Ltd or its management. MetaOptics Ltd does not by its reference above or distribution imply its endorsement of 
                                    or concurrence with such information, conclusions, or recommendations.
                                </div>
                            </div>
                        </div>                        
                    </div>

                </div>
            </div>
        </>
    );
};

export default AnalystCoverageAnnouncements;
