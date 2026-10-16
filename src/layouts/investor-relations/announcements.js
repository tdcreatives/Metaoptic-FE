'use client';

import React, { useRef, useState } from 'react';
import CompanyAnnouncementsSection from '@/layouts/investor-relations/company-announcements';

const SgxListingSection = () => {
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

    return (
        <div className="w-full bg-[#fff] rounded-t-lg px-6 py-8 flex flex-col items-center">
            <div className="w-full max-w-6xl">
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
    );
};

const Announcements = () => (
    <>
        <SgxListingSection />
        <CompanyAnnouncementsSection />
    </>
);

export default Announcements;
