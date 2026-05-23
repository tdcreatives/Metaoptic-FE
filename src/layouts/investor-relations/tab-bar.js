'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { investorRelationsTabs } from './tabs';
import './tab-bar.scss';

const isTabActive = (tab, pathname) => {
    if (tab.path === '/investor-relations') return pathname === '/investor-relations';
    return pathname === tab.path || pathname.startsWith(`${tab.path}/`);
};

const SubItemsDropdown = ({ items, pathname, onItemClick }) => (
    <div className='absolute left-0 top-full min-w-[220px] bg-white border border-[#E5E5E5] shadow-md z-30'>
        <ul className='flex flex-col py-2'>
            {items.map((sub) => {
                const isSubActive = pathname === sub.path;
                return (
                    <li key={sub.path}>
                        <Link
                            href={sub.path}
                            onClick={onItemClick}
                            className={clsx(
                                'block px-5 py-3 futura-medium text-[14px] md:text-[15px] tracking-wide transition-colors',
                                isSubActive
                                    ? 'text-[#d34c39] bg-[#FAFAFA]'
                                    : 'text-[#231F20] hover:bg-[#F5F5F5] hover:text-[#d34c39]'
                            )}
                        >
                            {sub.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    </div>
);

const TabItem = ({ tab, pathname }) => {
    const isActive = isTabActive(tab, pathname);
    const hasSubItems = Array.isArray(tab.subItems) && tab.subItems.length > 0;
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleDocClick);
        return () => document.removeEventListener('mousedown', handleDocClick);
    }, [open]);

    const handleParentClick = (e) => {
        if (!hasSubItems) return;
        e.preventDefault();
        setOpen((prev) => !prev);
    };

    return (
        <li ref={ref} className='shrink-0 relative'>
            <Link
                href={tab.path}
                onClick={handleParentClick}
                className={clsx(
                    'relative inline-block py-4 md:py-5 lg:py-6 text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] futura-medium uppercase tracking-wider transition-colors duration-200',
                    isActive ? 'text-[#d34c39]' : 'text-black hover:text-[#d34c39]'
                )}
            >
                {tab.label}
                {isActive && (
                    <span className='absolute left-0 right-0 bottom-0 h-[2px] md:h-[3px] bg-[#d34c39]' />
                )}
            </Link>

            {hasSubItems && open && (
                <SubItemsDropdown
                    items={tab.subItems}
                    pathname={pathname}
                    onItemClick={() => setOpen(false)}
                />
            )}
        </li>
    );
};

const InvestorRelationsTabBar = () => {
    const pathname = usePathname();

    return (
        <nav className='w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
            <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px]'>
                <ul className='flex items-center justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-12 whitespace-nowrap overflow-visible'>
                    {investorRelationsTabs.map((tab) => (
                        <TabItem key={tab.path} tab={tab} pathname={pathname} />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default InvestorRelationsTabBar;
