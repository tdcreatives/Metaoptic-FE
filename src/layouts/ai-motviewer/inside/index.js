'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';

const BASE = '/verticals/ai/motviewer';

const CARDS = [
    {
        video: `${BASE}/inside-1.mp4`,
        poster: `${BASE}/inside-1-poster.jpg`,
        title: 'Plug in and start capturing',
        description:
            'Plug a metalens camera in over USB and MOTviewer detects it automatically, across the full IoT line: Round RGB, Rectangular RGB, and Wide-FoV monochrome NIR. Save any setup as a profile and reload it in one click.',
    },
    {
        video: `${BASE}/inside-2.mp4`,
        poster: `${BASE}/inside-2-poster.jpg`,
        title: 'Multi-camera streaming',
        description:
            'Run multiple metalens cameras side by side, each in its own tab with its own pipeline and settings. Switch between live views without stopping capture.',
    },
    {
        video: `${BASE}/inside-3.mp4`,
        poster: `${BASE}/inside-3-poster.jpg`,
        title: 'Alignment and calibration',
        description:
            'Metalens optics split colour across the sensor. MOTviewer finds the red, green, and blue image centres, calibrates them per camera generation, and saves the result so every frame lands in register.',
    },
    {
        video: `${BASE}/inside-4.mp4`,
        poster: `${BASE}/inside-4-poster.jpg`,
        title: 'AI image enhancement',
        description:
            'Drop the AI enhancement plugin into your pipeline and recover detail in low light in real time. Toggle it on or off to compare. Run the dynamic model for any input size, or the static model for maximum speed.',
    },
    {
        image: `${BASE}/inside-5.png`,
        title: 'Fingerprint recognition',
        description:
            'Register and match fingerprints directly in the app using the on-board AFIS library, with live minutiae detection and bounding boxes. Gesture and 3D recognition plugins run the same way, on-device, with no external service.',
    },
    {
        video: `${BASE}/inside-6.mp4`,
        poster: `${BASE}/inside-6-poster.jpg`,
        title: 'Documentation',
        description:
            'A full user manual ships inside MOTviewer: GUI reference, per-camera setup, post-processing, the pipeline compiler, plugins, and the API and SDK reference. Help is one tab away, online or off.',
    },
];

// Video with a custom play-icon overlay (no native controls until playing)
const VideoCard = ({ src, poster }) => {
    const videoRef = useRef(null);
    const [playing, setPlaying] = useState(false);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    return (
        <div className="relative w-full">
            <video
                ref={videoRef}
                className="w-full h-auto cursor-pointer"
                poster={poster}
                preload="metadata"
                playsInline
                onClick={togglePlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
            >
                <source src={src} type="video/mp4" />
            </video>
            {!playing && (
                <button
                    type="button"
                    aria-label="Play video"
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/75">
                        <svg
                            className="ml-[4px] h-[26px] w-[26px]"
                            viewBox="0 0 24 24"
                            fill="white"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </span>
                </button>
            )}
        </div>
    );
};

const InsideMotviewer = () => {
    return (
        <section className="mx-auto w-full max-w-[1660px] px-[24px] py-[96px] xl:px-[72px]">
            {/* Label */}
            <div className="flex items-center gap-[24px]">
                <span className="inline-flex items-center gap-[24px] rounded-[8px] bg-[#d34c39] px-[32px] py-[16px]">
                    <Image
                        src={`${BASE}/inside-logo.png`}
                        alt=""
                        width={48}
                        height={48}
                        className="w-[48px] h-auto"
                    />
                    <span className="futura-condensed-medium font-medium uppercase text-[40px] leading-none text-white">
                        Inside MOTviewer
                    </span>
                </span>
                <span className="h-0 flex-1 border-t-2 border-[#A9A9A9]" />
            </div>

            {/* Cards */}
            <div className="mt-[64px] grid grid-cols-1 gap-x-[74px] gap-y-[80px] xl:grid-cols-2">
                {CARDS.map((card, index) => (
                    <div key={card.title || index} className="flex flex-col gap-[24px]">
                        {card.video ? (
                            <VideoCard src={card.video} poster={card.poster} />
                        ) : (
                            <Image
                                src={card.image}
                                alt={card.title || ''}
                                width={582}
                                height={345}
                                className="w-full h-auto"
                            />
                        )}
                        <div>
                            <h3 className="futura-condensed-medium font-medium uppercase text-[40px] leading-[1.1] text-[#0B0B0C]">
                                {card.title}
                            </h3>
                            {card.description && (
                                <p className="mt-[8px] text-[22px] font-normal text-black leading-relaxed">
                                    {card.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InsideMotviewer;
