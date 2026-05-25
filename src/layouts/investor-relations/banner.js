'use client';

import React from 'react';
import './banner.scss';

const InvestorRelationsBanner = ({ bannerTitle = 'INVESTOR<br/>RELATIONS', compact = false }) => {
    const [line1, line2] = bannerTitle.split('<br/>');

    const containerHeight = compact
        ? 'min-h-[220px] md:min-h-[280px] lg:min-h-[340px]'
        : 'min-h-[400px] md:min-h-[500px] lg:min-h-[567px]';

    const containerPadding = compact
        ? 'py-6 md:py-8 lg:py-10'
        : 'py-8 md:py-12 lg:py-16 xl:py-[52px]';

    const textSize = compact
        ? 'text-[40px] md:text-[56px] lg:text-[84px] xl:text-[120px] tracking-[0.4rem] md:tracking-wider lg:tracking-[4%]'
        : 'text-[48px] md:text-[60px] lg:text-[100px] xl:text-[170px] tracking-[1rem] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%]';

    return (
        <div className={`relative w-full bg-[#F0F0F0] overflow-hidden investor-relations-banner ${compact ? 'pb-10' : 'pb-20'}`}>
            <div
                className='absolute top-0 right-0 w-[200px] h-[185px] md:w-[300px] md:h-[277px] lg:w-[400px] lg:h-[367px] xl:w-[450px] xl:h-[415px] bg-cover bg-no-repeat bg-center banner-logo bg-[url(/investor-relations/logo-top-right.png)] bg-top-right'
            />
            <div
                className='absolute bottom-0 left-0 w-[246px] h-[172px] md:w-[370px] md:h-[259px] lg:w-[493px] lg:h-[251px] xl:w-[554px] xl:h-[388px] bg-cover bg-no-repeat bg-center banner-logo bg-[url(/investor-relations/logo-bottom-left.png)] bg-bottom-left'
            />

            <div className={`relative flex items-center justify-center px-4 md:px-8 lg:px-16 xl:px-[40px] w-full max-w-[1920px] mx-auto ${containerPadding} ${containerHeight}`}>

                <div className='relative flex flex-col justify-center w-full max-w-[1200px]'>
                    <div
                        className={`text-black futura-condensed-medium font-medium ${textSize} leading-[1.1] uppercase banner-text text-center${line2 ? (compact ? ' mb-2 md:mb-3 lg:mb-4' : ' mb-4 md:mb-6 lg:mb-8') : ''}`}
                        dangerouslySetInnerHTML={{ __html: line1 }}
                    />

                    {line2 && (
                        <div
                            className={`text-black futura-condensed-medium font-medium ${textSize} leading-[1.1] uppercase banner-text whitespace-normal break-words text-center`}
                            dangerouslySetInnerHTML={{ __html: line2 }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvestorRelationsBanner;
