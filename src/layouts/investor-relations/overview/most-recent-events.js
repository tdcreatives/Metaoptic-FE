import React from 'react';
import Link from 'next/link';
import EventRow from '@/layouts/investor-relations/event-row';
import IRContainer from '@/layouts/investor-relations/container';

const MOCK_EVENTS = [
    {
        id: 'evt-1',
        date: 'Jun 10, 2026, 9:00 AM SGT',
        title: 'Fourth Quarter and Full Year 2024 Financial Results Conference Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
    {
        id: 'evt-2',
        date: 'Jul 10, 2026, 9:00 AM SGT',
        title: '2026 Annual Meeting of Stockholders',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
    {
        id: 'evt-3',
        date: 'Aug 12, 2026, 9:00 AM SGT',
        title: 'Q2 2026 Earnings Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
];

const MostRecentEvents = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Most Recent Events
            </h2>

            <div className='mt-2'>
                {MOCK_EVENTS.map((event) => (
                    <EventRow key={event.id} event={event} />
                ))}
            </div>

            <div className='mt-8 md:mt-10'>
                <Link
                    href='/investor-relations/events-and-presentation'
                    className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
                >
                    View All Events
                </Link>
            </div>
        </IRContainer>
    );
};

export default MostRecentEvents;
