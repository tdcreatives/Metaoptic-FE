'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const NewsDetailsExtraImages = ({ news = {} }) => {
    const [firstImage, secondImage, thirdImage] = news.details.extraImages;

    return (
        <div className='pb-[100px]'>
            <div className='grid xl:grid-cols-3 grid-cols-1 gap-4'>
                {/* Left large image */}
                <div className='xl:col-span-2 col-span-1 h-[40vw] max-h-[600px] relative rounded-lg overflow-hidden shadow-lg'>
                    <motion.div
                        className='w-full h-full cursor-pointer'
                        whileHover={{ opacity: 0.9 }}
                        transition={{ type: 'spring' }}>
                        <Image
                            src={`/${firstImage}`}
                            alt='Main extra view'
                            fill
                            className='object-cover rounded-lg'
                        />
                    </motion.div>
                </div>

                {/* Right stacked images */}
                <div className='grid grid-rows-2 gap-4'>
                    <div className='xl:h-full h-[40vw] max-h-[600px] relative rounded-lg overflow-hidden shadow-md'>
                        <motion.div
                            className='w-full h-full cursor-pointer'
                            whileHover={{ opacity: 0.9 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                            <Image
                                src={`/${secondImage}`}
                                alt='Second extra view'
                                fill
                                className='object-cover rounded-lg'
                            />
                        </motion.div>
                    </div>
                    <div className='xl:h-full h-[40vw] max-h-[600px] relative rounded-lg overflow-hidden shadow-md'>
                        <motion.div
                            className='w-full h-full cursor-pointer'
                            whileHover={{ opacity: 0.9 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                            <Image
                                src={`/${thirdImage}`}
                                alt='Third extra view'
                                fill
                                className='object-cover rounded-lg'
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailsExtraImages;
