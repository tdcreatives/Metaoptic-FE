'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import Image from 'next/image';
import { gsap } from 'gsap';
import { isMobile } from '@/utils';

const Header = ({ background = '#fff' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathName = usePathname();

    const menuBtnRef = useRef(null);
    const menuRef = useRef(null);
    const menuItemRef = useRef(null);

    // Navigation links array
    const headers = [
        { label: 'ABOUT US', path: '/about-us' },
        { label: 'PRODUCTS', path: '/products' },
        { label: 'NEWS', path: '/news' },
        { label: 'CONTACT', path: '/contact-us' },
        { label: 'SHOP', path: '/shop' },
    ];

    const handleMenuShow = () => {
        gsap.to(menuBtnRef.current, {
            autoAlpha: 0,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                gsap.set(menuItemRef.current, {
                    x: '100%',
                    autoAlpha: 0,
                });
                gsap.to(menuItemRef.current, {
                    x: '0%',
                    autoAlpha: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                });
            },
        });
    };

    const handleMenuHidden = () => {
        gsap.to(menuItemRef.current, {
            x: '100%',
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                setIsMenuOpen(false);
                gsap.to(menuBtnRef.current, {
                    autoAlpha: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                });
            },
        });
    };

    const handleMobileMenuToggle = () => {
        if (isMenuOpen) {
            gsap.to(menuRef.current, {
                x: '100%',
                autoAlpha: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => setIsMenuOpen(false),
            });
        } else {
            gsap.set(menuRef.current, { x: '100%', autoAlpha: 0 });
            gsap.to(menuRef.current, {
                x: '0%',
                autoAlpha: 1,
                duration: 0.5,
                ease: 'power2.out',
                onStart: () => setIsMenuOpen(true),
            });
        }
    };

    useEffect(() => {
        gsap.set(menuItemRef.current, {
            x: '100%',
            autoAlpha: 0,
        });
    }, []);

    useEffect(() => {
        gsap.set(menuRef.current, { x: '100%', autoAlpha: 0 });
    }, []);

    const handleNavigation = (path) => {
        if (path.startsWith('/')) {
            router.push(path);
        } else {
            window.location.href = path; // For external or anchor links
        }
    };

    return (
        <div
            className='font-bold flex justify-between items-center max-w-[1920px] mx-auto px-[4.5vw] py-[4.44vh]'
            style={{
                background,
            }}>
            {/* Logo */}
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                className='xl:w-[20vw] w-[200px] h-auto cursor-pointer'
                priority
                onClick={() => router.push('/')}
            />

            {!isMobile() && (
                <div
                    className='flex justify-between items-center space-x-4'
                    onMouseEnter={handleMenuShow}
                    onMouseLeave={handleMenuHidden}>
                    {/* Navigation Bar */}
                    <nav
                        className='hidden xl:flex space-x-8 text-[20px] uppercase'
                        ref={menuItemRef}>
                        {headers.map((header) => (
                            <a
                                key={header.label}
                                className={`relative text-black hover:text-[#d44c39] cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                                    pathName === header.path
                                        ? 'after:!w-2 !text-[#d44c39]'
                                        : ''
                                }`}
                                onClick={() => handleNavigation(header.path)}>
                                {header.label}
                            </a>
                        ))}
                    </nav>

                    {/* Hamburger/Close Button */}
                    <div className='cursor-pointer'>
                        <Image
                            src='/menu.svg'
                            alt='Menu'
                            width='0'
                            height='0'
                            className='w-[40px] h-auto mb-1'
                            ref={menuBtnRef}
                            onClick={handleMenuShow}
                        />
                    </div>
                </div>
            )}

            {isMobile() && (
                <>
                    {/* Hamburger Button */}
                    <div className='cursor-pointer'>
                        <Image
                            src='/menu.svg'
                            alt='Menu'
                            width='0'
                            height='0'
                            className='w-[40px] h-auto mb-1'
                            onClick={handleMobileMenuToggle}
                        />
                    </div>

                    {/* Mobile Navigation Menu */}
                    <nav
                        className='fixed top-0 right-0 h-full w-full bg-white flex flex-col items-center justify-center space-y-8 text-[20px] uppercase z-50'
                        ref={menuRef}>
                        <Image
                            src='/close-icon.svg'
                            alt='Menu'
                            width='0'
                            height='0'
                            className='w-[40px] h-auto mb-1 absolute top-4 right-4'
                            onClick={handleMobileMenuToggle}
                        />
                        {headers.map((header) => (
                            <a
                                key={header.label}
                                className='text-black hover:text-[#d44c39] cursor-pointer'
                                onClick={() => handleNavigation(header.path)}>
                                {header.label}
                            </a>
                        ))}
                    </nav>
                </>
            )}
        </div>
    );
};

export default Header;
