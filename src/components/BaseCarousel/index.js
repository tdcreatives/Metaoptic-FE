import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const Carousel = ({ images, interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, interval);

        return () => clearInterval(timer);
    }, [images.length, interval, isPaused]);

    const handleDotClick = (index) => {
        if (index === currentIndex) return; // Prevent animation if clicking the same dot
        setCurrentIndex(index);
    };

    return (
        <div className='relative xl:w-[70%] mt-10 max-w-[1200px] mx-auto w-full'>
            <div
                className='relative rounded-lg shadow-lg overflow-hidden'
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>
                <div className='w-full xl:h-[30vw] h-[300px] relative max-h-[500px]'>
                    <AnimatePresence>
                        <motion.div
                            key={currentIndex}
                            className='absolute w-full h-full'
                            initial={{ x: '100%' }} // Slide in from the right
                            animate={{ x: 0 }} // Slide to the center
                            exit={{ x: '-100%' }} // Slide out to the left
                            transition={{
                                duration: 0.6,
                                ease: [0.17, 0.67, 0.83, 0.67], // Smooth cubic bezier for fluid motion
                            }}>
                            <Image
                                src={`/${images[currentIndex]}`}
                                alt={`Slide ${currentIndex + 1}`}
                                layout='fill'
                                objectFit='cover'
                                priority={currentIndex === 0}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Dot navigation */}
            <div
                className='absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-3 z-20'
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}>
                {images.map((_, index) => (
                    <motion.button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex === index ? 'bg-[#D44C39]' : 'bg-gray-300'
                        }`}
                        onClick={() => handleDotClick(index)}
                        whileHover={{ scale: 1.3 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
