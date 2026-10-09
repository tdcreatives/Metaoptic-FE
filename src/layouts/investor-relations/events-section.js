import React from 'react';
import EventRow from './event-row';
import IRContainer from './container';

const EventsSection = ({ title, events = [], emptyMessage = 'No events to display.', sectionId }) => {
    return (
        <IRContainer id={sectionId} className='py-12 md:py-16 lg:py-20 xl:pt-[60px] scroll-mt-24'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                {title}
            </h2>

            {events.length === 0 ? (
                <div className='mt-12 text-center text-[#888888] futura-medium'>{emptyMessage}</div>
            ) : (
                <div className='mt-2'>
                    {events.map((event) => (
                        <EventRow key={event.id} event={event} />
                    ))}
                </div>
            )}
        </IRContainer>
    );
};

export default EventsSection;
