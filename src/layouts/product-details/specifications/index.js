'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

import BaseButton from '@/components/BaseButton';
import IconButton from '@/components/IconButton';
import arrowDownIcon from '@/assets/images/arrow-down.png';

// Helper function to format keys
function formatKey(str) {
    let result = '';
    let inParens = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(') {
            if (!inParens && i > 0 && str[i - 1] !== ' ') result += ' ';
            inParens = true;
            result += char;
        } else if (char === ')') {
            inParens = false;
            result += char;
        } else if (!inParens && char === char.toUpperCase() && /[A-Z]/.test(char) && i > 0 && str[i - 1] !== ' ' && str[i - 1] !== '(') {
            result += ' ' + char;
        } else {
            result += char;
        }
    }
    return result.trim();
}

const ProductDetailsSpecifications = ({
    specifications,
    brochure,
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
            <ul className='mt-0 space-y-2 text-center text-white/90 list-disc list-inside'>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        );
    }, []);

    const activeButtons = [buttonLeft, brochure, buttonRight].filter(Boolean).length;
    const specificationLength = Object.entries(specifications).length;
    const column = activeButtons > specificationLength ? activeButtons : specificationLength;
    const gridColsClass =  'grid-cols-1 md:grid-cols-'+column ;

    return (
        <div className='w-full bg-[#d34c39] xl:py-6 py-3 xl:px-6 px-3 rounded-lg text-white'>
            {/* Specifications Title Row with Icon */}
            <div className='flex justify-between items-center mb-0'>
                <div className='xl:text-[48px] text-[32px] uppercase relative z-30 futura-condensed-medium xl:mt-0 mt-3 text-start'>
                    Specifications
                </div>

                <div
                    className={`transition-transform duration-300 ${
                        !isExpanded ? 'rotate-180' : ''
                    }`}
                    onClick={toggleAllSections}>
                    <Image
                        src='/product-details/up.svg'
                        alt='Expand/Collapse All'
                        width={0}
                        height={0}
                        className='cursor-pointer w-7 h-7 object-contain'
                    />
                </div>
            </div>

            <div className='w-full h-[2px] bg-white opacity-50 mx-auto mb-8'></div>
            <div className={`grid grid-cols-1 md:grid-cols-${specificationLength} gap-12 gap-12`}>
                {Object.entries(specifications).map(([section, specs], index) => (
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
                            <ul className='mt-0 space-y-2 text-center text-white/90'>
                                {Object.entries(specs).map(([key, value]) => (
                                    <li key={key} className='capitalize'>
                                        {key !== 'list' && (
                                            <strong>
                                                {formatKey(key)}:{' '}
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

            
            <div className={`grid grid-cols-1 md:grid-cols-${activeButtons} gap-12 gap-12`}>
                <div className='spec-section flex justify-center items-center'>
                    {buttonLeft && (
                        Array.isArray(buttonLeft?.link) ? (
                            <div className='relative group w-full max-w-xs'>
                                <IconButton
                                    label={`${buttonLeft?.name}`}
                                    icon={<Image src={arrowDownIcon} alt='arrow' width={16} height={16} />}
                                    classNameBtn='!text-[#d34c39] hover:!text-white uppercase'
                                    bgDefault='#fff'
                                    className='w-full'
                                />
                                <div className='absolute top-full mt-0 w-full bg-white shadow-lg rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto'>
                                    {buttonLeft.link.map((item, index) => (
                                        <button
                                            key={index}
                                            className='block w-full text-left px-4 py-2 text-[#d34c39] hover:bg-gray-100'
                                            onClick={() => {
                                                if (item.link.toLowerCase().endsWith('.pdf')) {
                                                    const link = document.createElement('a');
                                                    link.href = item.link;
                                                    link.download = item?.name || `file-${index + 1}`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                } else {
                                                    window.open(item.link, '_blank');
                                                }
                                            }}
                                        >
                                            {item?.name || `Link ${index + 1}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <BaseButton
                                label={buttonLeft?.name}
                                classNameBtn='!text-[#d34c39] hover:!text-white uppercase'
                                bgDefault='#fff'
                                className='w-full max-w-xs'
                                onClick={() => {
                                    if (buttonLeft?.link.toLowerCase().endsWith('.pdf')) {
                                        const link = document.createElement('a');
                                        link.href = buttonLeft?.link;
                                        link.download = buttonLeft?.name || 'file';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    } else {
                                        window.open(buttonLeft?.link, '_blank');
                                    }
                                }}
                            />
                        )
                    )}
                </div>
                <div className='spec-section flex justify-center items-center'>
                    {brochure && (
                        <BaseButton
                            label='Download Brochure'
                            classNameBtn='uppercase !text-[#d34c39] hover:!text-white'
                            bgDefault='#fff'
                            className='w-full max-w-xs'
                            onClick={() => {
                                if (brochure.toLowerCase().endsWith('.pdf')) {
                                    const link = document.createElement('a');
                                    link.href = brochure;
                                    link.download = 'brochure';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                } else {
                                    window.open(brochure, '_blank');
                                }
                            }}
                        />
                    )}
                </div>
                <div className='spec-section flex justify-center items-center'>
                    {buttonRight && (
                        Array.isArray(buttonRight?.link) ? (
                            <div className='relative group w-full max-w-xs'>
                                <IconButton
                                    label={`${buttonRight?.name}`}
                                    icon={<Image src={arrowDownIcon} alt='arrow' width={16} height={16} />}
                                    classNameBtn='!text-[#d34c39] hover:!text-white uppercase'
                                    bgDefault='#fff'
                                    className='w-full'
                                />
                                <div className='absolute top-full mt-0 w-full bg-white shadow-lg rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto'>
                                    {buttonRight.link.map((item, index) => (
                                        <button
                                            key={index}
                                            className='block w-full text-left px-4 py-2 text-[#d34c39] hover:bg-gray-100'
                                            onClick={() => {
                                                if (item?.link.toLowerCase().endsWith('.pdf')) {
                                                    const link = document.createElement('a');
                                                    link.href = item.link;
                                                    link.download = item?.name || `file-${index + 1}`;
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                } else {
                                                    window.open(item.link, '_blank');
                                                }
                                            }}
                                        >
                                            {item?.name || `Link ${index + 1}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <BaseButton
                                label={buttonRight?.name}
                                classNameBtn='!text-[#d34c39] hover:!text-white uppercase'
                                bgDefault='#fff'
                                className='w-full max-w-xs'
                                onClick={() => {
                                    if (buttonRight?.link.toLowerCase().endsWith('.pdf')) {
                                        const link = document.createElement('a');
                                        link.href = buttonRight?.link;
                                        link.download = buttonRight?.name || 'file';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    } else {
                                        window.open(buttonRight?.link, '_blank');
                                    }
                                }}
                            />
                        )
                    )}
                </div>
            </div>


        </div>
    );
};

export default ProductDetailsSpecifications;
