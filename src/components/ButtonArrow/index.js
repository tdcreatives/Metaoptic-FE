'use client';

import React from 'react';
import Link from 'next/link';

// Vector arrow that scales with the surrounding text (default width 18.5px)
const ArrowIcon = ({ className = 'w-[18.5px]' }) => (
    <svg
        className={`${className} h-auto`}
        viewBox="0 0 24 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M1 8h21M15 1l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/**
 * Reusable pill button with a trailing vector arrow.
 * Matches the brand hover-slide style used across the site.
 *
 * @param {string} label - Button text
 * @param {string} [href] - Renders a Link when provided, otherwise a <button>
 * @param {function} [onClick]
 * @param {React.ReactNode} [icon] - Override the default arrow icon
 * @param {string} [iconClassName] - Override the arrow icon width (default w-[18.5px])
 * @param {string} [className] - Classes applied to the outer wrapper
 * @param {string} [bgDefault] - Base background color
 */
const ButtonArrow = ({
    label,
    href,
    onClick,
    icon,
    iconClassName = 'w-[18.5px]',
    className = '',
    bgDefault = '#d34c39',
    type = 'button',
}) => {
    const content = (
        <span className="relative overflow-hidden inline-flex items-center gap-[12px] rounded-full text-white futura-medium uppercase text-[16px] tracking-[0.1em] py-[18px] px-[32px] transition-all duration-300 group">
            <span className="z-10 relative md:group-hover:!text-white transition-colors duration-300">
                {label}
            </span>
            <span className="z-10 relative flex items-center md:group-hover:!text-white transition-colors duration-300">
                {icon || <ArrowIcon className={iconClassName} />}
            </span>
            {/* Default background */}
            <span
                className="absolute inset-0"
                style={{ backgroundColor: bgDefault }}
            />
            {/* Sliding hover background - only on desktop */}
            <span className="absolute inset-0 bg-[#231f20] transition-transform duration-500 ease-in-out transform -translate-x-full md:group-hover:translate-x-0" />
        </span>
    );

    if (href) {
        return (
            <Link href={href} onClick={onClick} className={`inline-block ${className}`}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={`inline-block ${className}`}>
            {content}
        </button>
    );
};

export default ButtonArrow;
