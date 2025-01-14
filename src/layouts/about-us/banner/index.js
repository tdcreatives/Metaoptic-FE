'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BaseTitle from '@/components/BaseTitle';

import Image from 'next/image';

const AboutUsBanner = () => {
    return (
        <div className='mx-auto xl:px-[72px] px-[48px] xl:py-[48px] py-[24px]'>
            <BaseTitle
                title='About Metaoptics'
                className='!text-center futura-condensed-medium'
            />

            <div className='uppercase xl:text-[40px] text-[24px] tracking-[0.1rem] font-normal text-[#231f20] text-center'>
                REDEFINING WHAT’S POSSIBLE IN OPTICAL APPLICATIONS
            </div>

            <div className='xl:w-[80vw] w-[90vw] xl:mt-[60px] mt-[40px] mx-auto max-w-[1660px]'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{
                        opacity: 0.9,
                        transition: { duration: 0.5, ease: 'easeInOut' },
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <Image
                        src='/about-us/banner.png'
                        alt='Banner'
                        width='0'
                        height='0'
                        className='w-[70%] mx-auto max-w-[900px] cursor-pointer'
                    />
                </motion.div>

                <div className='xl:w-[50%] w-full ml-auto flex flex-col gap-5 xl:text-[20px] text-[16px] xl:my-8 my-4'>
                    <div>
                        We strive to become a global leader in metalens innovation,
                        combining advanced design expertise with scalable mass production
                        capabilities to redefine the future of optical technology by 2024.
                    </div>

                    <div>
                        Our focus is on developing a robust supply chain and
                        state-of-the-art manufacturing equipment, ensuring seamless
                        integration and unparalleled efficiency in metalens production for
                        diverse applications.
                    </div>

                    <div>
                        Through continuous innovation, precision engineering, and a
                        commitment to excellence, we aim to establish ourselves as a
                        Metalens Excellence Center, driving advancements that shape
                        industries worldwide.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsBanner;
