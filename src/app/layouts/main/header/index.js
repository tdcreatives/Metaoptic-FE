'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';
import { isMobile } from '@/app/utils';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const menuBtnRef = useRef(null);
    const menuRef = useRef(null);
    const menuItemRef = useRef(null);

    const handleMenuShow = () => {
        gsap.to(menuBtnRef.current, {
            autoAlpha: 0, // Make the hamburger button invisible
            duration: 0.2, // Animation duration for hiding
            ease: 'power2.in', // Smooth easing
            onComplete: () => {
                // After the hamburger button is hidden, slide in the menu
                gsap.set(menuItemRef.current, {
                    x: '100%', // Start offscreen to the right
                    autoAlpha: 0, // Ensure the menu starts hidden
                });

                gsap.to(menuItemRef.current, {
                    x: '0%', // Slide into its original position
                    autoAlpha: 1, // Make it visible
                    duration: 0.5, // Animation duration for showing
                    ease: 'power2.out', // Smooth easing
                });
            },
        });
    };
    const handleMenuHidden = () => {
        // Animate the navigation menu out of view
        gsap.to(menuItemRef.current, {
            x: '100%', // Move offscreen to the right
            autoAlpha: 0, // Hide it
            duration: 0.5, // Animation duration
            ease: 'power2.in', // Smooth easing
            onComplete: () => {
                // After the menu is hidden, update state and re-show the hamburger button
                setIsMenuOpen(false);

                gsap.to(menuBtnRef.current, {
                    autoAlpha: 1, // Make the hamburger button visible again
                    duration: 0.2, // Animation duration for showing
                    ease: 'power2.out', // Smooth easing
                });
            },
        });
    };

    const handleMobileMenuToggle = () => {
        if (isMenuOpen) {
            // Hide the mobile menu
            gsap.to(menuRef.current, {
                x: '100%', // Move offscreen to the right
                autoAlpha: 0, // Hide it
                duration: 0.5, // Animation duration
                ease: 'power2.in', // Smooth easing
                onComplete: () => setIsMenuOpen(false),
            });
        } else {
            // Show the mobile menu
            gsap.set(menuRef.current, { x: '100%', autoAlpha: 0 }); // Ensure it starts offscreen
            gsap.to(menuRef.current, {
                x: '0%', // Slide into view
                autoAlpha: 1, // Make it visible
                duration: 0.5, // Animation duration
                ease: 'power2.out', // Smooth easing
                onStart: () => setIsMenuOpen(true),
            });
        }
    };

    useEffect(() => {
        gsap.set(menuItemRef.current, {
            x: '100%', // Move offscreen to the right
            autoAlpha: 0, // Ensure the menu starts hidden
        });
    }, []);

    return (
        <div className='font-bold flex justify-between items-center max-w-[1920px] mx-auto px-[4.5vw] py-[4.44vh]'>
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
                        <a
                            href='#'
                            className='relative text-[#d44c39] hover:text-[#d44c39] after:block after:h-1 after:w-2 after:bg-[#d44c39] after:rounded-full after:mx-auto'>
                            ABOUT US
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            PRODUCTS
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            NEWS
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            CONTACT
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            SHOP
                        </a>
                    </nav>

                    {/* Hamburger/Close Button */}
                    <div className='cursor-pointer'>
                        <Image
                            src='/menu.svg' // Hamburger icon
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
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            ABOUT US
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            PRODUCTS
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            NEWS
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            CONTACT
                        </a>
                        <a href='#' className='text-black hover:text-[#d44c39]'>
                            SHOP
                        </a>
                    </nav>
                </>
            )}
        </div>
    );
};

export default Header;
