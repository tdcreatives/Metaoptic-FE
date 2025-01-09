'use client';

import React, { useState } from 'react';

import './index.scss';

const BaseHamburger = ({ onShow = () => {}, onHide = () => {} }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        if (isOpen) {
            onHide();
        } else {
            onShow();
        }

        setIsOpen(!isOpen);
    };

    return (
        <div id='nav-icon3' className={isOpen ? 'open' : ''} onClick={handleClick}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default BaseHamburger;
