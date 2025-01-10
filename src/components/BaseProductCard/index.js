'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import './index.scss';

const BaseProductCard = ({
    product,
    isHovered,
    isAnyHovered,
    onMouseEnter,
    onMouseLeave,
}) => {
    const router = useRouter();

    const renderTextWhenHovering = () => {
        if (isHovered) {
            const titleParts = product.title.split(' ');
            const firstHalf = titleParts
                .slice(0, Math.ceil(titleParts.length / 2))
                .join(' ');
            const secondHalf = titleParts
                .slice(Math.ceil(titleParts.length / 2))
                .join(' ');

            return (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className='text-[200px] text-white futura-condensed-medium absolute top-[120px] left-[-20px] z-1 w-[300%]'>
                    <div style={{ lineHeight: '1' }}>{firstHalf.toUpperCase()}</div>
                    <div className='mt-[-60px]'>{secondHalf.toUpperCase()}</div>
                </motion.div>
            );
        }
    };

    const renderLabelWhenHovering = () => {
        if (isHovered) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <div className='bg-transparent text-white px-4 py-1 text-[14px] rounded-full font-semibold mb-2 mt-[340px] text-[24px] w-fit border-[2px] border-white'>
                        {product.category}
                    </div>
                    <h2 className='text-white text-[70px] futura-condensed-medium mt-[-12px] w-[1000px]'>
                        {product.title}
                    </h2>
                    <p className='text-[#ffffffcc] text-[20px] mt-[-10px] w-[700px] overflow-hidden'>
                        {product.description}
                    </p>
                    <div className='absolute bottom-5 right-5 w-[190px]'>
                        <motion.button
                            initial={{ x: 200, opacity: 0 }} // Start 100px to the right and invisible
                            animate={{ x: 0, opacity: 1 }} // Slide to its original position and become fully visible
                            exit={{ x: 200, opacity: 0 }} // Slide out to the right when it disappears
                            transition={{
                                duration: 0.3,
                                ease: [0.37, 0, 0.63, 1],
                                delay: 0.3,
                            }} // Smooth transition timing
                            whileHover={{ scale: 1.05 }}
                            className='bg-black text-white px-6 py-3 rounded-full hover:bg-[#d44c39] text-[26px] futura-condensed-medium border-[2px] border-transparent hover:border-white transition-all whitespace-nowrap'>
                            FIND OUT MORE
                        </motion.button>
                    </div>
                </motion.div>
            );
        }
    };

    const renderImageWhenHovering = () => {
        if (isHovered) {
            return (
                <motion.div
                    className='absolute inset-0 z-10 flex justify-center items-center top-[-150px]'
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}>
                    <Image
                        src={`/${product?.image || 'fallback-image.svg'}`} // Fallback if the image is missing
                        alt='Product'
                        width='0'
                        height={400} // Fixed height
                        className='rounded-lg h-[400px] w-auto'
                        sizes='100vw'
                        style={{
                            objectFit: 'contain', // Ensures the image scales without cropping
                            objectPosition: 'center', // Center horizontally and vertically
                            maxWidth: '100%', // Prevent overflow
                            maxHeight: '100%',
                        }}
                    />
                </motion.div>
            );
        }
    };

    return (
        <motion.div
            className={`relative px-4 py-[32px] xl:w-full w-[90%] mx-auto product-card ${
                isHovered ? 'product-card--hovered' : ''
            } ${isAnyHovered && !isHovered ? 'product-card--shrink' : ''}`}
            onClick={() => router.push(`/product/${product.slug}`)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            layout>
            <motion.div
                className={`futura-condensed-medium text-[90px] product-card__id ${
                    isHovered ? 'text-white' : ''
                }`}
                layout>
                {product.id}
            </motion.div>

            {renderTextWhenHovering()}
            {renderLabelWhenHovering()}

            {isAnyHovered || isHovered ? (
                <></>
            ) : (
                <div className={`${isHovered ? 'mt-0' : 'mt-10'} z-10 relative flex`}>
                    <Image
                        width={600} // Set explicit width
                        height={400} // Set explicit height
                        sizes='(max-width: 768px) 100vw, 50vw' // Adjusted for responsive sizes
                        src={`/${product?.image || 'fallback-image.svg'}`} // Fallback if `product?.image` is undefined
                        alt='Product'
                        style={{
                            width: isHovered ? 'fit-content' : '90%',
                            marginLeft: 'auto',
                            height: isHovered ? '400px' : '300px',
                            objectFit: isHovered ? 'contain' : 'cover',
                            objectPosition: product?.objectPosition || 'center', // Default to 'center' if undefined
                            marginRight: isHovered ? 'auto' : '0',
                        }}
                    />
                </div>
            )}

            {renderImageWhenHovering()}

            {!isAnyHovered && (
                <motion.div
                    className='mt-16 w-full max-w-[300px] mx-auto text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: isHovered ? 0 : 0.5, // Add delay for unhover to let the text fade out before resizing
                    }}
                    layout>
                    <motion.div
                        className={`futura-condensed-medium text-[32px] product-card__title ${
                            isHovered ? 'text-white' : ''
                        }`}
                        layout
                        style={{
                            whiteSpace: 'normal', // Allow text to wrap
                            wordWrap: 'break-word', // Prevent overflow for long words
                            lineHeight: '1.4',
                            minHeight: '80px', // Keep consistent height for the text area
                            transition: 'opacity 0.3s ease-in-out', // Smooth fade-out for the text
                        }}>
                        {product.title}
                    </motion.div>

                    <motion.div
                        className='mt-4 ml-3 flex justify-start'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                            delay: 0.1, // Add slight delay for smoother unhover animation
                        }}>
                        <Image
                            width='50'
                            height='50'
                            src='/next-orange.svg'
                            alt='Next'
                            className='w-[50px]'
                        />
                    </motion.div>
                </motion.div>
            )}

            {isAnyHovered && !isHovered && (
                <motion.div
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}>
                    <div
                        className='futura-condensed-medium text-[40px] rotate-[-90deg] text-[#808285]'
                        style={{ whiteSpace: 'pre', marginTop: '100%' }}>
                        {product.title}
                    </div>
                    <Image
                        width='50'
                        height='50'
                        src='/next-orange.svg'
                        alt='Next'
                        className='w-[50px]'
                    />
                </motion.div>
            )}
        </motion.div>
    );
};

export default BaseProductCard;
