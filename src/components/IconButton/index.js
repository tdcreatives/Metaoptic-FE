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
            className={`flex xl:justify-center justify-center xl:mt-10 mt-6 ${className}`}>
            <button
                type={type}
                className={`relative overflow-hidden text-white font-bold py-3 rounded-full futura-medium xl:tracking-[2px] tracking-[2px] xl:text-[14px] text-[12px] transition-all duration-300 group w-full h-full ${classNameBtn}`}
                onClick={onClick}>
                <div className="flex flex-col sm:flex-row items-center justify-between px-10">
                    <span className={`z-10 relative text-left w-full sm:w-auto md:group-hover:!text-white transition-colors duration-300 ${classNameLabel || ''}`} dangerouslySetInnerHTML={{ __html: label }}></span>
                    <span className='z-10 relative mt-2 sm:mt-0 sm:ml-4 text-center sm:text-right w-full sm:w-auto md:group-hover:!text-white transition-colors duration-300 flex items-center justify-center sm:justify-end'>
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
