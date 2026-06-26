import React from 'react';

const BaseTitle = ({ title, className = '', as = 'h2' }) => {
    const Tag = as === 'h1' ? 'h1' : 'h2';

    return (
        <Tag
            className={`xl:text-[84px] text-[48px] text-[#d34c39] uppercase xl:text-start text-center ${className}`}>
            {title}
        </Tag>
    );
};

export default BaseTitle;
