import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import InvestorPresentation from '@/layouts/investor-relations/overview/investor-presentation';
import EventsSection from '@/layouts/investor-relations/events-section';

export const metadata = {
    title: 'Events & Presentation | Investor Relations | Metaoptics Technologies',
};

const UPCOMING_EVENTS = [
    {
        id: 'up-1',
        date: 'Jun 10, 2026, 9:00 AM SGT',
        title: 'Fourth Quarter and Full Year 2024 Financial Results Conference Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
    {
        id: 'up-2',
        date: 'Jul 10, 2026, 9:00 AM SGT',
        title: '2026 Annual Meeting of Stockholders',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
    {
        id: 'up-3',
        date: 'Aug 12, 2026, 9:00 AM SGT',
        title: 'Q2 2026 Earnings Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Add to Calendar', url: '#' },
        ],
    },
];

const PAST_EVENTS = [
    {
        id: 'past-1',
        date: 'Jun 10, 2026, 9:00 AM SGT',
        title: 'Fourth Quarter and Full Year 2024 Financial Results Conference Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Audio', url: '#' },
        ],
    },
    {
        id: 'past-2',
        date: 'Jul 10, 2026, 9:00 AM SGT',
        title: '2026 Annual Meeting of Stockholders',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Audio', url: '#' },
        ],
    },
    {
        id: 'past-3',
        date: 'Aug 12, 2026, 9:00 AM SGT',
        title: 'Q2 2026 Earnings Call',
        actions: [
            { label: 'Webcast', url: '#' },
            { label: 'Audio', url: '#' },
        ],
    },
];

const EventsAndPresentationPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='EVENTS & PRESENTATION' compact />
            <InvestorRelationsTabBar />
            <InvestorPresentation />
            <EventsSection title='Upcoming Events' events={UPCOMING_EVENTS} emptyMessage='No upcoming events.' />
            <EventsSection title='Past Events' events={PAST_EVENTS} emptyMessage='No past events.' />
        </>
    );
};

export default EventsAndPresentationPage;
