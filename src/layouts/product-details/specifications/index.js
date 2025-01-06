'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

import BaseButton from '@/components/BaseButton';

const ProductDetailsSpecifications = ({ specifications, brochure }) => {
    const [isExpanded, setIsExpanded] = useState(true); // Controls all sections' visibility

    useEffect(() => {
        const sections = document.querySelectorAll('.spec-section');
        gsap.fromTo(
            sections,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
        );
    }, []);

    const toggleAllSections = () => {
        setIsExpanded((prev) => !prev);
    };

    const renderImage = useCallback((section) => {
        switch (section) {
            case 'mechanicalDimensions':
                return (
                    <Image
                        src='/product-details/mechanic.png'
                        alt='Mechanic'
                        width='0'
                        height='0'
                        sizes='100vw'
                        className='xl:w-[48px] w-[32px] hover:scale-105 transition-transform duration-300 cursor-pointer'
                    />
                );

            case 'cameraSpecifications':
                return (
                    <Image
                        src='/product-details/camera.png'
                        alt='Camera'
                        width='0'
                        height='0'
                        sizes='100vw'
                        className='xl:w-[64px] w-[48px] xl:h-[48px] hover:scale-105 transition-transform duration-300 cursor-pointer'
                    />
                );

            case 'metalensSpecifications':
                return (
                    <Image
                        src='/product-details/metalens.png'
                        alt='Metalens'
                        width='0'
                        height='0'
                        sizes='100vw'
                        className='xl:w-[48px] w-[32px] xl:h-[48px] hover:scale-105 transition-transform duration-300 cursor-pointer'
                    />
                );

            default:
                return '';
        }
    }, []);

    return (
        <div className='w-full bg-[#d34c39] py-16 px-8 rounded-lg text-white'>
            {/* Specifications Title Row with Icon */}
            <div className='flex justify-between items-center mb-5'>
                <h2 className='xl:text-[60px] text-[32px] uppercase futura-condensed-medium tracking-wide'>
                    Specifications
                </h2>
                <div
                    className={`transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                    }`}
                    onClick={toggleAllSections}>
                    <Image
                        src='/product-details/down.png'
                        alt='Expand/Collapse All'
                        width={48}
                        height={48}
                        className='cursor-pointer'
                    />
                </div>
            </div>

            <div className='w-full h-[2px] bg-white opacity-50 mx-auto mb-8'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                {Object.entries(specifications).map(([section, specs], index) => (
                    <div key={index} className='spec-section flex flex-col gap-4'>
                        <div className='flex flex-col items-center'>
                            {renderImage(section)}

                            {section !== 'optionalSpecifications' &&
                                section !== 'empty' && (
                                    <h3 className='text-[24px] font-semibold text-center uppercase mt-5 futura-medium'>
                                        {section.replace(/([A-Z])/g, ' $1')}
                                    </h3>
                                )}
                        </div>

                        {/* Collapsible Content */}
                        <div
                            className={`overflow-hidden transition-all duration-500 ${
                                isExpanded
                                    ? 'max-h-[500px] opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}>
                            <ul className='mt-4 space-y-2 text-center text-white/90'>
                                {Object.entries(specs).map(([key, value]) => (
                                    <li key={key} className='capitalize'>
                                        <strong>
                                            {key.replace(/([A-Z])/g, ' $1')}:{' '}
                                        </strong>
                                        {value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <BaseButton
                label='Download Brochure'
                classNameBtn='uppercase !text-[#d34c39] hover:!text-white'
                bgDefault='#fff'
                className='!mt-[80px]'
                onClick={() => window.open(brochure, '_blank')}
            />
        </div>
    );
};

export default ProductDetailsSpecifications;
