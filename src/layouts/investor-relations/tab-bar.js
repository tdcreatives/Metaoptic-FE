'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';
import { getInvestorRelationsTabs } from './tabs';
import './tab-bar.scss';
import './ir-scroll.scss';

const TAB_LABEL_CLASS =
    'relative inline-flex items-center gap-1.5 shrink-0 snap-center py-4 text-[13px] md:text-[14px] futura-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap';

const isTabActive = (tab, pathname) => {
    if (tab.path === '/investor-relations') return pathname === '/investor-relations';
    return pathname === tab.path || pathname.startsWith(`${tab.path}/`);
};

const isSubItemActive = (sub, pathname, hash) => {
    const [basePath, anchor] = sub.path.split('#');
    if (anchor) {
        return pathname === basePath && hash === `#${anchor}`;
    }
    return pathname === sub.path;
};

const usePathHash = () => {
    const pathname = usePathname();
    const [hash, setHash] = useState('');

    useEffect(() => {
        const updateHash = () => setHash(window.location.hash);
        updateHash();
        window.addEventListener('hashchange', updateHash);
        return () => window.removeEventListener('hashchange', updateHash);
    }, [pathname]);

    return { pathname, hash };
};

/* ============================== Desktop ============================== */

const SubItemsDropdown = ({ items, pathname, hash }) => (
    <div className='absolute left-0 top-full min-w-[220px] bg-white border border-[#E5E5E5] shadow-md z-30'>
        <ul className='flex flex-col py-2'>
            {items.map((sub) => {
                const isSubActive = isSubItemActive(sub, pathname, hash);
                return (
                    <li key={sub.path}>
                        <Link
                            href={sub.path}
                            className={clsx(
                                'block px-5 py-3 futura-medium text-[14px] tracking-wide transition-colors',
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

const DesktopTabItem = ({ tab, pathname, hash }) => {
    const isActive = isTabActive(tab, pathname);
    const hasSubItems = Array.isArray(tab.subItems) && tab.subItems.length > 0;
    const [hovering, setHovering] = useState(false);
    const open = hasSubItems && hovering;

    const labelClass = clsx(
        TAB_LABEL_CLASS,
        'md:py-5 lg:py-6',
        isActive ? 'text-[#d34c39]' : 'text-black hover:text-[#d34c39]',
        hasSubItems && 'cursor-default'
    );

    const labelContent = (
        <>
            {tab.label}
            {hasSubItems && (
                <IconChevronDown
                    size={14}
                    strokeWidth={2}
                    className={clsx('transition-transform duration-200', open && 'rotate-180')}
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
                <Link href={tab.path} className={labelClass}>
                    {labelContent}
                </Link>
            ) : (
                <Link href={tab.path} className={labelClass}>
                    {labelContent}
                </Link>
            )}

            {open && <SubItemsDropdown items={tab.subItems} pathname={pathname} hash={hash} />}
        </li>
    );
};

const DesktopTabBar = ({ pathname, hash }) => {
    const investorRelationsTabs = getInvestorRelationsTabs();

    return (
        <nav className='hidden xl:block w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
            <div className='w-full px-[24px] xl:px-[72px]'>
                <ul className='flex items-center justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-12 whitespace-nowrap overflow-visible'>
                    {investorRelationsTabs.map((tab) => (
                        <DesktopTabItem key={tab.path} tab={tab} pathname={pathname} hash={hash} />
                    ))}
                </ul>
            </div>
        </nav>
    );
};

/* ============================== Mobile ============================== */

const MobileTabBar = ({ pathname, hash }) => {
    const investorRelationsTabs = getInvestorRelationsTabs();
    const activeTab =
        investorRelationsTabs.find((t) => isTabActive(t, pathname)) || investorRelationsTabs[0];
    const activeSubItems = Array.isArray(activeTab.subItems) ? activeTab.subItems : [];

    return (
        <nav className='xl:hidden w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
            <div
                className='ir-horizontal-scroll flex items-center gap-6 px-6 py-1 snap-x snap-mandatory'
                role='tablist'
                aria-label='Investor relations sections'
            >
                {investorRelationsTabs.map((tab) => {
                    const isActive = isTabActive(tab, pathname);
                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            role='tab'
                            aria-selected={isActive}
                            className={clsx(
                                TAB_LABEL_CLASS,
                                isActive ? 'text-[#d34c39]' : 'text-[#231F20]'
                            )}
                        >
                            {tab.label}
                            {isActive && (
                                <span className='absolute left-0 right-0 bottom-0 h-[2px] bg-[#d34c39]' />
                            )}
                        </Link>
                    );
                })}
            </div>

            {activeSubItems.length > 0 && (
                <div
                    className='ir-horizontal-scroll flex items-center gap-4 px-6 py-3 border-t border-[#E5E5E5] bg-[#FAFAFA] snap-x snap-mandatory'
                    role='tablist'
                    aria-label={`${activeTab.label} sub-sections`}
                >
                    {activeSubItems.map((sub) => {
                        const isSubActive = isSubItemActive(sub, pathname, hash);
                        return (
                            <Link
                                key={sub.path}
                                href={sub.path}
                                role='tab'
                                aria-selected={isSubActive}
                                className={clsx(
                                    'shrink-0 snap-center px-4 py-2 rounded-full futura-medium text-[13px] tracking-wide transition-colors whitespace-nowrap',
                                    isSubActive
                                        ? 'bg-[#d34c39] text-white'
                                        : 'bg-white text-[#231F20] border border-[#E5E5E5]'
                                )}
                            >
                                {sub.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
};

/* ============================== Root ============================== */

const InvestorRelationsTabBar = () => {
    const { pathname, hash } = usePathHash();

    return (
        <>
            <MobileTabBar pathname={pathname} hash={hash} />
            <DesktopTabBar pathname={pathname} hash={hash} />
        </>
    );
};

export default InvestorRelationsTabBar;
