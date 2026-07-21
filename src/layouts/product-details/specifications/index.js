'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';

import DownloadIconButton, { DownloadDropdownButton } from '@/components/DownloadIconButton';
import { toBrochureFileName } from '@/utils/product';

function formatKey(str) {
    const formatSegment = (segment, { inParens }) => {
        const lowerToUpper = inParens
            ? /([a-z])([A-Z])(?=[a-z]{2,})/g
            : /([a-z])([A-Z])/g;
        return segment
            .replace(lowerToUpper, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    };

    return str
        .replace(/\([^)]*\)|[^()]+/g, (segment) => {
            if (segment.startsWith('(')) {
                const inner = formatSegment(segment.slice(1, -1), { inParens: true });
                return `(${inner})`;
            }
            return formatSegment(segment, { inParens: false });
        })
        .replace(/([^\s(])\(/g, '$1 (')
        .trim();
}

const ProductDetailsSpecifications = ({
    specifications,
    brochureTitle,
    brochure,
    userGuide,
    installer,
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

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

            case 'substrateSpecifications':
                return (
                    <Image
                        src='/product-details/mechanic.png'
                        alt='Substrate'
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

    const renderListLine = useCallback((list = []) => {
        return (
            <>
                {list.map((item, index) => (
                    <div key={index} className='flex flex-col space-y-1 mb-5'>
                        <strong className='block uppercase'>{item.title}</strong>
                        <span className='block' dangerouslySetInnerHTML={{ __html: item.line }} />
                    </div>
                ))}
            </>
        );
    }, []);

    const specificationLength = Object.entries(specifications).length;
    const hasButtons = brochure || userGuide || installer;

    return (
        <div className='w-full bg-[#d34c39] lg:py-12 py-8 lg:px-10 px-6 rounded-[32px] text-white'>
            <div className='flex justify-between items-center mb-0'>
                <div className='xl:text-[48px] lg:text-[40px] text-[32px] uppercase relative z-30 futura-condensed-medium lg:mt-0 mt-3 text-start'>
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
            <div className={`grid grid-cols-1 lg:grid-cols-${specificationLength} gap-12`}>
                {Object.entries(specifications).map(([section, specs], index) => (
                    <div key={index} className='spec-section flex flex-col gap-8'>
                        <div className='flex flex-col items-center'>
                            {renderImage(section)}

                            {section !== 'optionalSpecifications' &&
                                section !== 'empty' && (
                                    <h3 className='xl:text-[20px] lg:text-[18px] text-[16px] font-semibold text-center uppercase mt-5 futura-medium'>
                                        {section.replace(/([A-Z])/g, ' $1')}
                                    </h3>
                                )}
                        </div>

                        <div
                            className={`overflow-hidden transition-all duration-500 ${
                                isExpanded
                                    ? 'max-h-[1000px] opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}>
                            <ul className='mt-0 space-y-2 text-center text-white/90'>
                                {Object.entries(specs).map(([key, value]) => (
                                    <li key={key} >
                                        {key === 'list-line' ? (
                                            <div className='space-y-3'>
                                                {renderListLine(value)}
                                            </div>
                                        ) : (
                                            <>
                                                {key !== 'list' && (
                                                    <strong className='capitalize'>
                                                        {formatKey(key)}:{' '}
                                                    </strong>
                                                )}
                                                {Array.isArray(value) ? renderList(value) : (
                                                    <span dangerouslySetInnerHTML={{ __html: value }} />
                                                )}
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {hasButtons && (
                <div className='flex flex-wrap justify-center items-center gap-6 lg:gap-[68px] mt-12'>
                    {brochure && (
                        <DownloadIconButton
                            label='Brochure'
                            href={brochure}
                            download={toBrochureFileName(brochureTitle)}
                            variant='light'
                        />
                    )}
                    {userGuide && (
                        <DownloadIconButton
                            label={userGuide.name || 'User guide'}
                            href={userGuide.link}
                            download={userGuide.name || 'user-guide'}
                            variant='light'
                        />
                    )}
                    {installer && (
                        Array.isArray(installer?.link) ? (
                            <DownloadDropdownButton
                                label={installer?.name || 'MOT Viewer installer files'}
                                items={installer.link}
                                variant='light'
                            />
                        ) : (
                            <DownloadIconButton
                                label={installer?.name || 'MOT Viewer installer files'}
                                href={installer?.link}
                                download={installer?.name || 'installer'}
                                variant='light'
                            />
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductDetailsSpecifications;
