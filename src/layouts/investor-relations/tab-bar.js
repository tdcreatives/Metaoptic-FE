'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronDown, IconChevronUp, IconChevronRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { getInvestorRelationsTabs } from './tabs';
import './tab-bar.scss';
import './ir-scroll.scss';

const TAB_LABEL_CLASS =
    'relative inline-flex items-center gap-1.5 shrink-0 snap-center py-4 text-[13px] md:text-[14px] futura-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap';

// A tab only behaves as a dropdown/accordion when it has MORE THAN ONE visible
// sub-item. A lone sub-item (e.g. EVENTS → only "Investor Presentation" after the
// launch flags hide the rest) just points back to the parent page, so the tab is
// rendered as a plain direct link instead.
const tabHasDropdown = (tab) =>
    Array.isArray(tab.subItems) && tab.subItems.length > 1;

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
    const hasSubItems = tabHasDropdown(tab);
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
    const [menuOpen, setMenuOpen] = useState(false);
    const [expandedPaths, setExpandedPaths] = useState({});

    const toggleExpand = (path) =>
        setExpandedPaths((prev) => ({ ...prev, [path]: !prev[path] }));

    const closeMenu = () => setMenuOpen(false);

    const activeTab =
        investorRelationsTabs.find((t) => isTabActive(t, pathname)) || investorRelationsTabs[0];
    const activeSubItem = tabHasDropdown(activeTab)
        ? (activeTab.subItems || []).find((sub) => isSubItemActive(sub, pathname, hash))
        : null;
    const collapsedLabel = activeSubItem ? activeSubItem.label : activeTab.label;

    return (
        <nav className='xl:hidden relative z-40 w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
            {/* Trigger — stays in flow so page content never jumps */}
            <button
                type='button'
                onClick={() => setMenuOpen((o) => !o)}
                aria-label='Toggle IR sub-navigation'
                aria-expanded={menuOpen}
                className='flex items-center justify-between w-full px-6 py-4 futura-medium uppercase tracking-wider text-[14px] text-[#231F20]'
            >
                <span>{collapsedLabel}</span>
                <IconChevronDown size={20} className='text-[#231F20]' />
            </button>

            {menuOpen && (
                <>
                    {/* Backdrop captures outside taps */}
                    <div
                        className='fixed inset-0 z-30'
                        aria-hidden='true'
                        onClick={closeMenu}
                    />
                    {/* Accordion overlay — anchored at top-0 so the active row replaces
                        the trigger (no duplicate label) and floats over page content */}
                    <div className='absolute top-0 left-0 right-0 z-40 bg-white border-b border-[#E5E5E5] shadow-lg'>
                        <ul>
                            {investorRelationsTabs.map((tab) => {
                                const isActive = isTabActive(tab, pathname);
                                const hasSubItems = tabHasDropdown(tab);
                                const isManuallyExpanded = !!expandedPaths[tab.path];
                                const showSubItems =
                                    hasSubItems && (isActive || isManuallyExpanded);

                                return (
                                    <li
                                        key={tab.path}
                                        className='border-b border-[#E5E5E5] last:border-b-0'
                                    >
                                        <div className='flex items-center'>
                                            {hasSubItems ? (
                                                <span
                                                    className={clsx(
                                                        'flex-1 px-6 py-4 futura-medium uppercase tracking-wider text-[14px] cursor-default',
                                                        isActive
                                                            ? 'text-[#d34c39]'
                                                            : 'text-[#231F20]'
                                                    )}
                                                >
                                                    {tab.label}
                                                </span>
                                            ) : (
                                                <Link
                                                    href={tab.path}
                                                    onClick={closeMenu}
                                                    className={clsx(
                                                        'flex-1 px-6 py-4 futura-medium uppercase tracking-wider text-[14px]',
                                                        isActive
                                                            ? 'text-[#d34c39]'
                                                            : 'text-[#231F20]'
                                                    )}
                                                >
                                                    {tab.label}
                                                </Link>
                                            )}

                                            {isActive ? (
                                                <button
                                                    type='button'
                                                    onClick={closeMenu}
                                                    aria-label='Close IR sub-navigation'
                                                    className='px-4 py-4 flex items-center justify-center'
                                                >
                                                    <IconChevronUp
                                                        size={20}
                                                        className='text-[#d34c39]'
                                                    />
                                                </button>
                                            ) : (
                                                hasSubItems && (
                                                    <button
                                                        type='button'
                                                        onClick={() => toggleExpand(tab.path)}
                                                        aria-label={`Toggle ${tab.label} sub-items`}
                                                        aria-expanded={isManuallyExpanded}
                                                        className='px-4 py-4 flex items-center justify-center'
                                                    >
                                                        {isManuallyExpanded ? (
                                                            <IconChevronDown
                                                                size={20}
                                                                className='text-[#231F20]'
                                                            />
                                                        ) : (
                                                            <IconChevronRight
                                                                size={20}
                                                                className='text-[#231F20]'
                                                            />
                                                        )}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        {showSubItems && (
                                            <ul className='bg-[#FAFAFA] border-t border-[#E5E5E5]'>
                                                {tab.subItems.map((sub) => {
                                                    const isSubActive = isSubItemActive(
                                                        sub,
                                                        pathname,
                                                        hash
                                                    );
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
                    </div>
                </>
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
