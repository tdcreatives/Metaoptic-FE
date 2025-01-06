'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useRouter } from 'next/navigation';

import BaseButton from '@/components/BaseButton';

import { isMobile } from '@/utils';

const AboutUs = () => {
    const router = useRouter();
    const imagesRef = useRef([]); // Reference to track all images
    const sectionRef = useRef(null); // Reference for the AboutUs section

    useEffect(() => {
        // Register GSAP ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Clear previous animations (if any)
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        // Ensure imagesRef.current is not empty
        if (imagesRef.current.length > 0) {
            // Apply animations to each image
            imagesRef.current.forEach((image) => {
                if (isMobile()) {
                    // Always show images immediately if mobile
                    gsap.set(image, { opacity: 1, y: 0 });
                } else {
                    // Apply scroll-based animations for non-mobile devices
                    gsap.fromTo(
                        image,
                        { opacity: 0, y: 50 }, // Initial hidden state
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1.5,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: image, // Trigger per image
                                scroller: window, // Default scroller
                                start: 'top 90%', // Start animation when image is 90% into the viewport
                                end: 'top 30%', // End animation when image leaves viewport
                                toggleActions: 'play', // Replay animation when re-entering view
                            },
                        }
                    );
                }
            });

            // Refresh ScrollTrigger on load
            ScrollTrigger.refresh();
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            className='relative flex xl:flex-row flex-col xl:h-[140vh] h-auto snap-start xl:pt-16 pt-8'
            id='about-us'>
            {/* Left Content */}
            <div className='flex flex-col'>
                <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium xl:ml-16 ml-0 xl:text-start text-center'>
                    About Us
                </h2>

                {/* Content with Background */}
                <div className='bg-[#ebebeb] xl:p-16 p-8 rounded-lg'>
                    <p className='text-[20px] mb-6 xl:max-w-[39%] max-w-full'>
                        At Metaoptics Technologies, we are breaking through current lens
                        limitations in consumer and IoT applications.
                    </p>

                    <p className='text-[20px] leading-relaxed mb-6 xl:max-w-[39%] max-w-full'>
                        Our high-throughput meta lens production ensures efficiency and
                        cost-effectiveness.
                    </p>
                    <p className='text-[20px] leading-relaxed mb-6 xl:max-w-[39%] max-w-full'>
                        As AR/VR and HUD technologies rapidly expands, our innovative meta
                        lens are essential to provide miniaturization in supporting this
                        market growth.
                    </p>

                    <BaseButton
                        label='Find out more'
                        classNameBtn='uppercase'
                        className='xl:!justify-start !justify-center xl:!ml-10 !ml-0'
                        onClick={() => router.push('/about-us')}
                    />
                </div>
            </div>

            {/* Right Section with Overlapping Images */}
            <div className='xl:absolute relative right-0 xl:w-[58%] w-[95%] mx-auto h-full xl:mt-0 mt-10'>
                <div className='grid grid-cols-2 xl:gap-5 gap-3'>
                    <div className='flex flex-col xl:gap-5 gap-3'>
                        <Image
                            src='/about-1.jpg'
                            alt='About 1'
                            width={0}
                            height={500}
                            sizes='100vw'
                            objectFit='contain'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px] object-cover opacity-0' // Initially hidden
                            ref={(el) => (imagesRef.current[0] = el)} // Add to refs
                        />

                        <Image
                            src='/about-3.jpg'
                            alt='About 3'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px] object-cover opacity-0' // Initially hidden
                            ref={(el) => (imagesRef.current[1] = el)} // Add to refs
                        />
                    </div>

                    <div className='flex flex-col xl:gap-5 gap-3 mb-[-48px] mt-[52px]'>
                        <Image
                            src='/about-2.jpg'
                            alt='About 2'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px] object-cover opacity-0' // Initially hidden
                            ref={(el) => (imagesRef.current[2] = el)} // Add to refs
                        />
                        <Image
                            src='/about-4.jpg'
                            alt='About 4'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px] object-cover opacity-0' // Initially hidden
                            ref={(el) => (imagesRef.current[3] = el)} // Add to refs
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
