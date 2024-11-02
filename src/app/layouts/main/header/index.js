'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenuOnOutsideClickOrScroll = (e) => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isMenuOpen && !e.target.closest('.sidebar')) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleOutsideClick);
            window.addEventListener('scroll', closeMenuOnOutsideClickOrScroll);
        } else {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', closeMenuOnOutsideClickOrScroll);
        }
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('scroll', closeMenuOnOutsideClickOrScroll);
        };
    }, [isMenuOpen]);

    return (
        <div className='font-bold flex justify-between max-w-[1920px] mx-auto px-[4.5vw] py-[4.44vh]'>
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                className='xl:w-[9vw] w-[84px] h-auto cursor-pointer'
                priority
                onClick={() => router.push('/')}
            />

            <Image
                src='/menu.svg'
                alt='Menu'
                width='0'
                height='0'
                className='xl:w-[4vw] w-[32px] h-auto cursor-pointer'
                priority
                onClick={toggleMenu}
            />

            {/* Sidebar Menu */}
            <div
                className={`sidebar fixed top-[4vh] right-[4vw] h-fit max-w-[400px] bg-[#e2e2d4] transform transition-width duration-500 ease-in-out overflow-hidden py-6 rounded-[2px] ${
                    isMenuOpen ? 'ml:w-[400px] w-[300px]' : 'w-0'
                }`}
                style={{
                    zIndex: 1000,
                }}>
                <div
                    className={`flex justify-end items-center px-6 ${
                        isMenuOpen ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200`}>
                    <Image
                        src='/close-icon.svg'
                        alt='Close'
                        width='0'
                        height='0'
                        className='xl:w-[32px] xl:h-[32px] w-[24px] h-[24px] cursor-pointer'
                        onClick={toggleMenu}
                    />
                </div>
                <ul
                    className={`futura-book px-6 space-y-[2px] ${
                        isMenuOpen ? 'opacity-100' : 'opacity-0'
                    } transition-opacity duration-200`}>
                    <li
                        className='relative xl:text-[24px] text-[20px] cursor-pointer text-[#d44c39] duration-200 rounded-sm whitespace-nowrap hover:after:content-after hover:before:content-before transition-all after:text-[16px] before:text-[16px] before:absolute before:top-[50%] before:-translate-y-1/2 after:absolute after:top-[50%] after:-translate-y-1/2 before:left-[-8px] after:right-[-8px] w-fit'
                        onClick={() => router.push('/')}>
                        Home
                    </li>
                    <li
                        className='relative xl:text-[24px] text-[20px] cursor-pointer text-[#d44c39] duration-200 rounded-sm whitespace-nowrap hover:after:content-after hover:before:content-before transition-all after:text-[16px] before:text-[16px] before:absolute before:top-[50%] before:-translate-y-1/2 after:absolute after:top-[50%] after:-translate-y-1/2 before:left-[-8px] after:right-[-8px] w-fit'
                        onClick={() => router.push('/contact-us')}>
                        Contact Us
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
