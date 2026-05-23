import React from 'react';
import Link from 'next/link';

const MOCK_EVENTS = [
    {
        id: 'evt-1',
        date: 'Jun 10, 2026, 9:00 AM SGT',
        title: 'Fourth Quarter and Full Year 2024 Financial Results Conference Call',
        webcastUrl: '#',
        calendarUrl: '#',
    },
    {
        id: 'evt-2',
        date: 'Jul 10, 2026, 9:00 AM SGT',
        title: '2026 Annual Meeting of Stockholders',
        webcastUrl: '#',
        calendarUrl: '#',
    },
    {
        id: 'evt-3',
        date: 'Aug 12, 2026, 9:00 AM SGT',
        title: 'Q2 2026 Earnings Call',
        webcastUrl: '#',
        calendarUrl: '#',
    },
];

const EventRow = ({ event }) => (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 py-6 md:py-7 border-b border-[#E5E5E5]'>
        <div className='flex flex-col gap-2 md:gap-3 flex-1 min-w-0'>
            <div className='futura-medium text-[14px] md:text-[16px] font-medium text-[#888888]'>
                {event.date}
            </div>
            <div className='futura-medium text-[18px] md:text-[20px] font-medium text-[#231F20] leading-snug'>
                {event.title}
            </div>
        </div>
        <div className='flex items-center gap-6 md:gap-10 shrink-0'>
            <a
                href={event.webcastUrl}
                className='futura-medium text-[14px] md:text-[16px] font-medium text-[#d34c39] uppercase tracking-wider hover:opacity-70 transition-opacity'
            >
                Webcast
            </a>
            <a
                href={event.calendarUrl}
                className='futura-medium text-[14px] md:text-[16px] font-medium text-[#d34c39] uppercase tracking-wider hover:opacity-70 transition-opacity'
            >
                Add to Calendar
            </a>
        </div>
    </div>
);

const MostRecentEvents = () => {
    return (
        <section className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
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
        </section>
    );
};

export default MostRecentEvents;
