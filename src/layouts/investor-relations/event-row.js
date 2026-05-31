import React from 'react';

const EventRow = ({ event }) => {
    const actions = event.actions || [];
    return (
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 py-6 md:py-7 border-b border-[#E5E5E5]'>
            <div className='flex flex-col gap-2 md:gap-3 flex-1 min-w-0'>
                <div className='futura-medium text-[14px] md:text-[16px] font-medium text-[#888888]'>
                    {event.date}
                </div>
                <div className='futura-medium text-[18px] md:text-[20px] font-medium text-[#231F20] leading-snug'>
                    {event.title}
                </div>
            </div>
            {actions.length > 0 && (
                <div className='ir-horizontal-scroll md:overflow-visible'>
                    <div className='flex items-center gap-6 md:gap-10 shrink-0 min-w-max md:min-w-0'>
                    {actions.map((action) => (
                        <a
                            key={action.label}
                            href={action.url || '#'}
                            target={action.url && action.url !== '#' ? '_blank' : undefined}
                            rel={action.url && action.url !== '#' ? 'noopener noreferrer' : undefined}
                            className='futura-medium text-[14px] md:text-[16px] font-medium text-[#d34c39] uppercase tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap'
                        >
                            {action.label}
                        </a>
                    ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventRow;
