'use client';

import React from 'react';

const BaseButton = ({
    label,
    className,
    classNameBtn,
    onClick,
    bgDefault = '#d34c39',
    bgHover = '#231f20',
    type = 'button',
}) => {
    // Light hover fills need dark label text so it stays readable
    const hoverIsLight =
        typeof bgHover === 'string' &&
        /^(#fff|#ffffff|#f5f5f5|#e5e5e5|#d4d4d4|white)$/i.test(bgHover.trim());

    return (
        <div
            className={`flex xl:justify-center justify-center xl:mt-10 mt-6 ${className}`}>
            <button
                type={type}
                className={`relative overflow-hidden text-white font-bold px-10 py-3 rounded-full futura-medium xl:tracking-[2px] tracking-[2px] xl:text-[16px] text-[12px] transition-all duration-300 group ${classNameBtn}`}
                onClick={onClick}>
                <span
                    className={`z-10 relative transition-colors duration-300 ${
                        hoverIsLight ? 'md:group-hover:text-[#231f20]' : ''
                    }`}>
                    {label}
                </span>
                {/* Default background */}
                <span
                    className='absolute inset-0 bg-[#d34c39]'
                    style={{
                        backgroundColor: bgDefault,
                    }}></span>
                {/* Sliding hover background - only on desktop */}
                <span
                    className='absolute inset-0 transition-transform duration-500 ease-in-out transform -translate-x-full md:group-hover:translate-x-0'
                    style={{
                        backgroundColor: bgHover,
                    }}></span>
            </button>
        </div>
    );
};

export default BaseButton;
