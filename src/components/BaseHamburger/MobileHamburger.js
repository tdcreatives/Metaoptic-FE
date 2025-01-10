'use client';

import React, { useState } from 'react';

import './index.scss';

const BaseMobileHamburger = ({ className = '', onClick = () => {} }) => {
    const handleClick = () => {
        onClick();
    };

    return (
        <div id='nav-icon3' className={className} onClick={handleClick}>
            <span></span>
            <span></span>
        </div>
    );
};

export default BaseMobileHamburger;
