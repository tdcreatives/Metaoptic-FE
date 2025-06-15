'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

import BaseButton from '@/components/BaseButton';

const ProductDetailsTestingCapabilities = ({
    testingCapabilities,
    buttonLeft,
    buttonRight,
}) => {
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
                        className='xl:w-[40px] w-[32px] hover:scale-105 transition-transform duration-300 cursor-pointer'
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
                        className='xl:w-[56px] w-[48px] xl:h-[40px] hover:scale-105 transition-transform duration-300 cursor-pointer'
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
                        className='xl:w-[40px] w-[32px] xl:h-[40px] hover:scale-105 transition-transform duration-300 cursor-pointer'
                    />
                );

            default:
                return '';
        }
    }, []);

    const renderList = useCallback((list = []) => {
        return (
            <ul className='mt-0 space-y-2 text-center text-[rgb(17,17,17)] list-disc list-inside'>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    }, []);

    return (
        <div className='w-full bg-[rgba(234,234,234,1)] xl:py-6 py-3 xl:px-6 px-3 rounded-lg text-[rgb(17,17,17)]'>
            {/* Specifications Title Row with Icon */}
            <div className='flex justify-between items-center mb-0'>
                <div className='xl:text-[48px] text-[32px] uppercase relative z-30 futura-condensed-medium xl:mt-0 mt-3 text-start'>
                    Testing Capabilities
                </div>

                <div
                    className={`transition-transform duration-300 ${
                        !isExpanded ? 'rotate-180' : ''
                    }`}
                    onClick={toggleAllSections}>
                    <Image
                        src='/product-details/up-orange.svg'
                        alt='Expand/Collapse All'
                        width={0}
                        height={0}
                        className='cursor-pointer w-7 h-7 object-contain'
                    />
                </div>
            </div>

            <div className='w-full h-[2px] bg-[rgba(17,17,17,1)] mx-auto mb-8'></div>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
                {Object.entries(testingCapabilities).map(([section, specs], index) => (
                    <div key={index} className='spec-section flex flex-col gap-4'>
                        <div className='flex flex-col items-center'>
                            {renderImage(section)}

                            {section !== 'optionalSpecifications' &&
                                section !== 'empty' && (
                                    <h3 className='xl:text-[20px] text-[16px] font-semibold text-center uppercase mt-5 futura-medium'>
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
                            <ul className='mt-0 space-y-2 text-center text-[rgb(17,17,17)]'>
                                {Object.entries(specs).map(([key, value]) => (
                                    <li
                                        key={key}
                                        className='capitalize'
                                        style={{
                                            fontWeight: 500,
                                        }}>
                                        {key !== 'list' && (
                                            <strong>
                                                {key.replace(/([A-Z])/g, ' $1')}:{' '}
                                            </strong>
                                        )}
                                        {Array.isArray(value) ? renderList(value) : value}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
                <div className='spec-section flex flex-col gap-4'>
                    {buttonLeft && (
                        <BaseButton
                            label={buttonLeft?.name}
                            classNameBtn=' !text-[#d34c39] hover:!text-white'
                            bgDefault='#fff'
                            className='!mt-[80px]'
                            onClick={() => window.open(buttonLeft?.link, '_blank')}
                        />
                    )}
                </div>
                <div className='spec-section flex flex-col gap-4'>
                    {buttonRight && (
                        <BaseButton
                            label={buttonRight?.name}
                            classNameBtn=' !text-[#d34c39] hover:!text-white'
                            bgDefault='#fff'
                            className='!mt-[80px]'
                            onClick={() => window.open(buttonRight?.link, '_blank')}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsTestingCapabilities;
