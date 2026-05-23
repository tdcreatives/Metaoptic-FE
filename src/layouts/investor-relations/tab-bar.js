'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { investorRelationsTabs } from './tabs';
import './tab-bar.scss';

const InvestorRelationsTabBar = () => {
  const pathname = usePathname();

  return (
    <nav className='w-full bg-white border-b border-[#E5E5E5] investor-relations-tab-bar'>
      <div className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px]'>
        <ul className='flex items-center gap-6 md:gap-8 lg:gap-10 xl:gap-12 overflow-x-auto whitespace-nowrap no-scrollbar'>
          {investorRelationsTabs.map((tab) => {
            const isActive = pathname === tab.path;
            return (
              <li key={tab.path} className='shrink-0'>
                <Link
                  href={tab.path}
                  className={clsx(
                    'relative inline-block py-4 md:py-5 lg:py-6 text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] futura-medium uppercase tracking-wider transition-colors duration-200',
                    isActive ? 'text-[#d44c39]' : 'text-black hover:text-[#d44c39]'
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <span className='absolute left-0 right-0 bottom-0 h-[2px] md:h-[3px] bg-[#d44c39]' />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default InvestorRelationsTabBar;
