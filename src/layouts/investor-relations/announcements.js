'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import items from '@/constants/announcements.json';
import IconButton from '@/components/IconButton';
import arrowIcon from '@/assets/images/arrow.png';
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

const Announcements = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const handleOnNavigate = (slug) => {
        router.push(`/annountcement/${slug}`);
    };

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

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
            <div className="w-full bg-[#fff] rounded-t-lg px-6 py-8 flex flex-col items-center">
                <div className="w-full max-w-6xl">
                    {/* Header Section */}
                    <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-[32px] lg:text-[48px] font-medium uppercase futura-condensed-medium text-black leading-[1.5]">
                        METAOPTICS LTD SGX LISTING
                        </h1>
                    </div>
                    <div className="w-full relative">
                        <video
                        ref={videoRef}
                        className="w-full"
                        controls
                        poster="https://metaoptics.sg/videos/Metaoptics-Event-Video_6.jpg"
                        >
                        <source src="https://metaoptics.sg/videos/Metaoptics-Event-Video_6.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                        </video>
                        {!isPlaying && (
                        <button
                            onClick={handlePlay}
                            className="absolute inset-0 m-auto w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-opacity"
                        >
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                            </svg>
                        </button>
                        )}
                    </div>
                    </div>
                </div>
            </div>
            <div className='w-full bg-[#D34C39] rounded-t-lg px-6 py-8'>
                {/* Header Section */}
                <div className='mb-8'>
                    <div className='flex justify-between items-center mb-4'>
                        <h1 className='text-[48px] font-medium uppercase futura-condensed-medium text-white leading-[1.5]'>
                            Company ANNOUNCEMENTS
                        </h1>
                    </div>
                    <div className='w-full h-[2px] bg-white opacity-50'></div>
                </div>

                {/* Announcements List */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-x-0 md:gap-x-12 gap-y-8 md:gap-y-[72px] !mt-[80px]'>
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className='flex flex-col w-full h-full'
                        >
                            {/* Date */}
                            <div className='flex items-center justify-center md:justify-start gap-2 px-0 md:px-10 py-2 mb-2 md:mb-0'>
                                <div className='text-[20px] font-medium futura-condensed-medium text-white leading-[1.2] text-center md:text-left'>
                                    {item.date}
                                </div>
                            </div>

                            {/* Title Container */}
                            <div className='w-full h-[100px] flex-shrink-0'>
                                <IconButton
                                    label={isMobile ? truncateString(item.title_btn_sm, 80) : truncateString(item.title_btn,100)}
                                    icon={<Image src={arrowIcon} alt='arrow' width={24}  className='w-8 h-8 flex-shrink-0' />}
                                    classNameBtn='uppercase !text-black md:group-hover:!text-white w-full h-full flex items-center'
                                    classNameLabel='line-clamp-2 overflow-hidden text-ellipsis break-words'
                                    bgDefault='#fff'
                                    className='!mt-[10px] !justify-start w-full h-full'                        
                                    onClick={() => handleOnNavigate(item.slug)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Announcements;
