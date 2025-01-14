import React from 'react';

const BaseTitle = ({ title, className = '' }) => {
    return (
        <h2
            className={`xl:text-[84px] text-[48px] text-[#d34c39] uppercase xl:text-start text-center ${className}`}>
            {title}
        </h2>
    );
};

export default BaseTitle;
