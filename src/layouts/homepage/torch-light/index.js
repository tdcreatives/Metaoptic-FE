'use client';

import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { isMobile } from 'react-device-detect';
import './index.scss';

const TorchlightText = () => {
    const containerRef = useRef();

    useEffect(() => {
        const container = containerRef.current;

        const handleMouseMove = (e) => {
            const bounds = container.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            // Smoothly update the position of the spotlight
            gsap.to(container, {
                '--x': `${x}px`,
                '--y': `${y}px`,
                duration: 0.1,
                ease: 'power3.out',
            });
        };

        container.addEventListener('mousemove', handleMouseMove);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const renderText = useCallback(() => {
        if (isMobile) {
            return (
                <h2 className='text'>
                    “Pushing the <span>boundaries</span> of what is possible in optics,{' '}
                    <span>combining</span> portability, {!isMobile && <br />}
                    precision, and performance”
                </h2>
            );
        } else {
            return (
                <h2 className='text'>
                    “Pushing the <span>boundaries</span> of what is possible
                    <br />
                    in optics, <span>combining</span> portability,
                    <br />
                    precision, and performance”
                </h2>
            );
        }
    }, [isMobile]);

    return (
        <div className='wrapper xl:h-[30vh] h-fit flex items-center justify-center'>
            <div ref={containerRef} className='torchlight-container'>
                {renderText()}
            </div>
        </div>
    );
};

export default TorchlightText;
