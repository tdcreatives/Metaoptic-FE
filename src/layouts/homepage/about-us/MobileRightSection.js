'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { isMobile } from 'react-device-detect';

const MobileRightSection = () => {
    const imagesRef = useRef([]); // Reference to track all images

    useEffect(() => {
        // Register GSAP ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Clear previous animations (if any)
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        // Ensure imagesRef.current is not empty
        if (imagesRef.current.length > 0) {
            // Apply animations to each image
            imagesRef.current.forEach((image) => {
                if (isMobile) {
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
        <div className='xl:absolute relative right-0 xl:w-[58%] w-[95%] mx-auto h-fit xl:mt-0 mt-10'>
            <div className='flex flex-col gap-3'>
                <div className='grid grid-cols-2s gap-3'>
                    <motion.div
                        className='relative rounded-lg overflow-hidden shadow-lg'
                        whileHover={{
                            rotateX: 5, // Slight tilt along X-axis
                            rotateY: -5, // Slight tilt along Y-axis
                            scale: 1.02, // Subtle zoom
                            transition: { duration: 0.4 },
                        }}>
                        <Image
                            src='/about-1.jpg'
                            alt='About 1'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='rounded-lg w-full h-[300px] rounded-[30px] xl:h-[350px] object-cover'
                            ref={(el) => (imagesRef.current[0] = el)}
                        />
                        <motion.div
                            className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0'
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}></motion.div>
                    </motion.div>

                    <motion.div
                        className='relative rounded-lg overflow-hidden shadow-lg'
                        whileHover={{
                            rotateX: 5,
                            rotateY: -5,
                            scale: 1.02,
                            transition: { duration: 0.4 },
                        }}>
                        <Image
                            src='/about-3.jpg'
                            alt='About 3'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='rounded-lg w-full h-[300px] rounded-[30px] xl:h-[350px] object-cover'
                            ref={(el) => (imagesRef.current[1] = el)}
                        />
                        <motion.div
                            className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0'
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}></motion.div>
                    </motion.div>
                </div>

                <div className='flex flex-col xl:gap-4 gap-3'>
                    <motion.div
                        className='relative rounded-lg overflow-hidden shadow-lg '
                        whileHover={{
                            rotateX: 5,
                            rotateY: -5,
                            scale: 1.02,
                            transition: { duration: 0.4 },
                        }}>
                        <Image
                            src='/about-4.jpg'
                            alt='About 4'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='rounded-lg w-full h-[300px] rounded-[30px] xl:h-[350px] object-cover'
                            ref={(el) => (imagesRef.current[3] = el)}
                        />
                        <motion.div
                            className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center opacity-0'
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}></motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MobileRightSection;
