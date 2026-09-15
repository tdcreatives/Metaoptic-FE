'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BaseButton from '@/components/BaseButton';

const PlayOverlay = ({ onClick }) => (
    <button
        type='button'
        aria-label='Play video'
        onClick={onClick}
        className='absolute inset-0 flex items-center justify-center'
    >
        <span className='flex h-[64px] w-[64px] xl:h-[72px] xl:w-[72px] items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/75'>
            <svg
                className='ml-[4px] h-[24px] w-[24px] xl:h-[26px] xl:w-[26px]'
                viewBox='0 0 24 24'
                fill='white'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
            >
                <path d='M8 5v14l11-7z' />
            </svg>
        </span>
    </button>
);

const ClickToPlayVideo = ({ src, poster }) => {
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
        // Videos are 406×720 (~9:16) — lock the frame so nothing crops/squashes
        <div className='relative w-full aspect-[9/16] overflow-hidden rounded-[20px] bg-black'>
            <video
                ref={videoRef}
                className='absolute inset-0 h-full w-full object-contain cursor-pointer'
                poster={poster}
                preload='metadata'
                playsInline
                controls={playing}
                onClick={togglePlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
            >
                <source src={src} type='video/mp4' />
            </video>
            {!playing && <PlayOverlay onClick={togglePlay} />}
        </div>
    );
};

/**
 * Dark video + copy block for select product pages.
 * Data-driven via product.details.videoSection.
 */
const ProductDetailsVideoSection = ({ videoSection, buyNow, buyNowText }) => {
    if (!videoSection?.src) return null;

    const {
        title,
        description,
        src,
        poster,
        ctaLabel,
        ctaHref,
    } = videoSection;

    const href = ctaHref || buyNow;
    const label = ctaLabel || buyNowText || 'Buy Now';
    const isExternal = href?.toLowerCase().startsWith('http');

    const cta = href ? (
        isExternal ? (
            <a href={href} target='_blank' rel='noopener noreferrer'>
                <BaseButton
                    label={label}
                    className='!mt-8 !justify-start'
                    bgHover='#ffffff'
                />
            </a>
        ) : (
            <Link href={href}>
                <BaseButton
                    label={label}
                    className='!mt-8 !justify-start'
                    bgHover='#ffffff'
                />
            </Link>
        )
    ) : null;

    return (
        <section className='relative overflow-hidden bg-[#121212]'>
            {/* Corner motifs — flush to edges; muted so they don't compete with content */}
            <Image
                src='/product-details/video-decor-top-right.png'
                alt=''
                aria-hidden='true'
                width={309}
                height={504}
                className='pointer-events-none absolute top-0 right-0 z-0 hidden h-auto w-[220px] select-none opacity-10 xl:block'
            />
            <Image
                src='/product-details/video-decor-bottom-left.png'
                alt=''
                aria-hidden='true'
                width={387}
                height={447}
                className='pointer-events-none absolute bottom-0 left-0 z-0 hidden h-auto w-[240px] select-none opacity-10 xl:block'
            />

            <div className='relative z-[1] mx-auto flex w-full flex-col items-center gap-[40px] px-[24px] py-[64px] xl:flex-row xl:items-center xl:gap-0 xl:px-0 xl:py-[96px]'>
                {/* PC: 50% left — video centered in half */}
                <div className='flex w-full justify-center xl:w-1/2'>
                    <div className='w-full max-w-[360px] xl:max-w-[420px]'>
                        <ClickToPlayVideo src={src} poster={poster} />
                    </div>
                </div>

                {/* PC: 50% right — text with ~5% left padding */}
                <div className='w-full xl:w-1/2 xl:pl-[5%] xl:pr-[72px]'>
                    {title && (
                        <h2 className='futura-medium font-medium text-white text-[28px] leading-[1.2] xl:text-[40px]'>
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className='futura-book mt-[20px] text-[15px] leading-relaxed text-white/90 xl:text-[18px] xl:mt-[24px] xl:max-w-[520px]'>
                            {description}
                        </p>
                    )}
                    {cta}
                </div>
            </div>
        </section>
    );
};

export default ProductDetailsVideoSection;
