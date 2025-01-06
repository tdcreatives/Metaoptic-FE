'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

export const Timeline = ({ data }) => {
    const ref = useRef(null);
    const containerRef = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setHeight(rect.height);
        }
    }, [ref]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 10%', 'end 50%'],
    });

    const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div className='w-full bg-transparent' ref={containerRef}>
            <div ref={ref} className='relative max-w-7xl mx-auto pb-20'>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className='flex justify-start pt-10 md:pt-40 flex-col'>
                        <div className='flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full'>
                            <div className='xl:absolute hidden left-[40px] w-[32px] h-[2px] bg-[#fff] opacity-50'></div>
                            <h3 className='md:pl-[100px] pl-[60px] font-bold text-[#d34c39] tracking-widest futura-condensed-medium xl:text-[100px] text-[40px]'>
                                {item.title}
                            </h3>
                        </div>

                        <div className='relative pr-4 md:pl-[100px] pl-[60px] w-full'>
                            {item.content}{' '}
                        </div>
                    </div>
                ))}
                <div
                    style={{
                        height: height + 'px',
                    }}
                    className='absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] '>
                    <motion.div
                        style={{
                            height: heightTransform,
                            opacity: opacityTransform,
                        }}
                        className='absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#d34c39] via-orange-400 to-transparent from-[0%] via-[40%] to-[80%] rounded-full animate-pulse'
                    />
                </div>
            </div>
        </div>
    );
};
