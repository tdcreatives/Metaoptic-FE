'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { getInvestorRelationsTabs } from './tabs';
import './tab-bar.scss';

const isTabActive = (tab, pathname) => {
    if (tab.path === '/investor-relations') return pathname === '/investor-relations';
    return pathname === tab.path || pathname.startsWith(`${tab.path}/`);
};

/* ============================== Desktop ============================== */

const SubItemsDropdown = ({ items, pathname }) => (
    <div className='absolute left-0 top-full min-w-[220px] bg-white border border-[#E5E5E5] shadow-md z-30'>
        <ul className='flex flex-col py-2'>
            {items.map((sub) => {
                const isSubActive = pathname === sub.path;
                return (
                    <li key={sub.path}>
                        <Link
                            href={sub.path}
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

const DesktopTabItem = ({ tab, pathname }) => {
    const isActive = isTabActive(tab, pathname);
    const hasSubItems = Array.isArray(tab.subItems) && tab.subItems.length > 0;
    const [hovering, setHovering] = useState(false);

    const open = hasSubItems && hovering;

    const labelClass = clsx(
        'relative inline-flex items-center gap-2 py-4 md:py-5 lg:py-6 text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] futura-medium uppercase tracking-wider transition-colors duration-200',
        isActive ? 'text-[#d34c39]' : 'text-black hover:text-[#d34c39]',
        hasSubItems && 'cursor-default'
    );

    const labelContent = (
        <>
            {tab.label}
            {hasSubItems && (
                <IconChevronDown
                    size={16}
                    strokeWidth={2}
                    className={clsx(
                        'transition-transform duration-200',
                        open && 'rotate-180'
                    )}
                />
            )}
            {isActive && (
                <span className='absolute left-0 right-0 bottom-0 h-[2px] md:h-[3px] bg-[#d34c39]' />
            )}
        </>
    );

    return (
        <li
            className='shrink-0 relative'
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {hasSubItems ? (
                <span className={labelClass}>{labelContent}</span>
            ) : (
                <Link href={tab.path} className={labelClass}>
                    {labelContent}
                </Link>
            )}

            {open && <SubItemsDropdown items={tab.subItems} pathname={pathname} />}
        </li>
    );
};

const DesktopTabBar = ({ pathname }) => {
    const investorRelationsTabs = getInvestorRelationsTabs();

    return (
    <nav className='hidden xl:block w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
        <div className='w-full px-[24px] xl:px-[72px]'>
            <ul className='flex items-center justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-12 whitespace-nowrap overflow-visible'>
                {investorRelationsTabs.map((tab) => (
                    <DesktopTabItem key={tab.path} tab={tab} pathname={pathname} />
                ))}
            </ul>
        </div>
    </nav>
    );
};

const MobileTabBar = ({ pathname }) => {
    const investorRelationsTabs = getInvestorRelationsTabs();
    const [open, setOpen] = useState(false);
    const [expandedPath, setExpandedPath] = useState(null);

    const activeTab =
        investorRelationsTabs.find((t) => isTabActive(t, pathname)) || investorRelationsTabs[0];

    const closeMenu = () => {
        setOpen(false);
        setExpandedPath(null);
    };

    if (!open) {
        return (
            <nav className='xl:hidden w-full bg-white border-b border-[#E5E5E5]'>
                <button
                    type='button'
                    onClick={() => setOpen(true)}
                    aria-label='Open IR sub-navigation'
                    className='flex items-center justify-between w-full px-6 py-4 futura-medium uppercase tracking-wider text-[15px] text-[#d34c39]'
                >
                    {activeTab.label}
                    <IconChevronDown size={20} className='text-[#d34c39]' />
                </button>
            </nav>
        );
    }

    return (
        <nav className='xl:hidden w-full bg-white border-b border-[#E5E5E5]'>
            <ul>
                {investorRelationsTabs.map((tab) => {
                    const isActive = isTabActive(tab, pathname);
                    const hasSubItems =
                        Array.isArray(tab.subItems) && tab.subItems.length > 0;
                    const isManuallyExpanded = expandedPath === tab.path;
                    const showSubItems = hasSubItems && (isActive || isManuallyExpanded);

                    return (
                        <li
                            key={tab.path}
                            className='border-b border-[#E5E5E5] last:border-b-0'
                        >
                            <div className='flex items-center'>
                                {hasSubItems ? (
                                    <span
                                        className={clsx(
                                            'flex-1 px-6 py-3 futura-medium uppercase tracking-wider text-[14px] cursor-default',
                                            isActive ? 'text-[#d34c39]' : 'text-[#231F20]'
                                        )}
                                    >
                                        {tab.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={tab.path}
                                        onClick={closeMenu}
                                        className={clsx(
                                            'flex-1 px-6 py-3 futura-medium uppercase tracking-wider text-[14px]',
                                            isActive ? 'text-[#d34c39]' : 'text-[#231F20]'
                                        )}
                                    >
                                        {tab.label}
                                    </Link>
                                )}

                                {isActive && (
                                    <button
                                        type='button'
                                        onClick={() => setOpen(false)}
                                        aria-label='Close sub-navigation'
                                        className='px-4 py-3'
                                    >
                                        <IconChevronUp size={20} className='text-[#d34c39]' />
                                    </button>
                                )}

                                {!isActive && hasSubItems && (
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setExpandedPath((prev) =>
                                                prev === tab.path ? null : tab.path
                                            )
                                        }
                                        aria-label='Expand sub-items'
                                        className='px-4 py-3'
                                    >
                                        <IconChevronRight
                                            size={18}
                                            className={clsx(
                                                'text-[#231F20] transition-transform duration-200',
                                                isManuallyExpanded && 'rotate-90'
                                            )}
                                        />
                                    </button>
                                )}
                            </div>

                            {showSubItems && (
                                <ul className='bg-[#FAFAFA] border-t border-[#E5E5E5]'>
                                    {tab.subItems.map((sub) => {
                                        const isSubActive = pathname === sub.path;
                                        return (
                                            <li key={sub.path}>
                                                <Link
                                                    href={sub.path}
                                                    onClick={closeMenu}
                                                    className={clsx(
                                                        'block px-10 py-3 futura-medium text-[14px]',
                                                        isSubActive
                                                            ? 'text-[#d34c39]'
                                                            : 'text-[#231F20]'
                                                    )}
                                                >
                                                    {sub.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

/* ============================== Root ============================== */

const InvestorRelationsTabBar = () => {
    const pathname = usePathname();
    const investorRelationsTabs = getInvestorRelationsTabs();
    return (
        <>
            <MobileTabBar pathname={pathname} />
            <DesktopTabBar pathname={pathname} />
        </>
    );
};

export default InvestorRelationsTabBar;
