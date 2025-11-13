'use client';

import React from 'react';

const IconButton = ({
    label,
    icon,
    className,
    classNameBtn,
    classNameLabel,
    onClick,
    bgDefault = '#d34c39',
    type = 'button',
}) => {
    return (
        <div
            className={`flex xl:justify-center justify-center xl:mt-10 mt-6 w-full ${className}`}>
            <button
                type={type}
                className={`relative overflow-hidden text-white font-bold py-4 px-6 pb-5 md:py-3 md:px-10 rounded-[78px] md:rounded-full futura-medium xl:tracking-[2px] tracking-[2px] xl:text-[14px] text-[12px] transition-all duration-300 group w-full h-full ${classNameBtn}`}
                onClick={onClick}>
                <div className="flex flex-col sm:flex-row items-center w-full gap-4 sm:gap-0">
                    <span className={`z-10 relative text-left sm:text-left w-full sm:w-3/4 sm:pr-4 md:group-hover:!text-white transition-colors duration-300 flex items-center ${classNameLabel || ''}`} dangerouslySetInnerHTML={{ __html: label }}></span>
                    <span className='z-10 relative text-center sm:text-right w-full sm:w-1/4 sm:pl-4 md:group-hover:!text-white transition-colors duration-300 flex items-center justify-center sm:justify-end'>
                        <span className='scale-100 sm:scale-[1.3] transition-transform duration-300'>{icon}</span>
                    </span>
                </div>
                {/* Default background */}
                <span
                    className='absolute inset-0 bg-[#d34c39]'
                    style={{
                        backgroundColor: bgDefault,
                    }}></span>
                {/* Sliding hover background - only on desktop */}
                <span className='absolute inset-0 bg-[#231f20] transition-transform duration-500 ease-in-out transform -translate-x-full md:group-hover:translate-x-0'></span>
            </button>
        </div>
    );
};
export default IconButton;
