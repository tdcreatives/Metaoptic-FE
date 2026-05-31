import { isIrSubItemVisible } from '@/constants/ir-feature-flags';

const investorRelationsTabsBase = [
  { label: 'OVERVIEW', path: '/investor-relations', bannerTitle: 'INVESTOR<br/>RELATIONS' },
  {
    label: 'NEWS',
    path: '/investor-relations/news',
    bannerTitle: 'NEWS',
    subItems: [
      { label: 'Press Releases', path: '/investor-relations/news/press-releases' },
      { label: 'Media', path: '/investor-relations/news/media' },
    ],
  },
  {
    label: 'EVENTS & PRESENTATION',
    path: '/investor-relations/events-and-presentation',
    bannerTitle: 'EVENTS &<br/>PRESENTATION',
    subItems: [
      { label: 'Investor Presentation', path: '/investor-relations/events-and-presentation#investor-presentation' },
      { label: 'Upcoming Events', path: '/investor-relations/events-and-presentation#upcoming-events', launchFlag: 'showUpcomingEvents' },
      { label: 'Past Events', path: '/investor-relations/events-and-presentation#past-events', launchFlag: 'showPastEvents' },
    ],
  },
  {
    label: 'STOCK INFO',
    path: '/investor-relations/stock-info',
    bannerTitle: 'STOCK INFO',
    subItems: [
      { label: 'Stock Quote', path: '/investor-relations/stock-info/stock-quote' },
      { label: 'Analyst Coverage', path: '/investor-relations/stock-info/analyst-coverage' },
    ],
  },
  {
    label: 'FINANCIALS',
    path: '/investor-relations/financials',
    bannerTitle: 'FINANCIALS',
    subItems: [
      { label: 'SEC Filings', path: '/investor-relations/financials/sec-filings' },
      { label: 'Quarterly Results', path: '/investor-relations/financials/quarterly-results' },
    ],
  },
  {
    label: 'GOVERNANCE',
    path: '/investor-relations/governance',
    bannerTitle: 'GOVERNANCE',
    subItems: [
      { label: 'Documents & Charters', path: '/investor-relations/governance/documents-and-charters' },
      { label: 'Board Of Directors', path: '/investor-relations/governance/board-of-directors' },
      { label: 'Management Team', path: '/investor-relations/governance/management-team' },
      { label: 'Committee Composition', path: '/investor-relations/governance/committee-composition' },
    ],
  },
  {
    label: 'RESOURCES',
    path: '/investor-relations/resources',
    bannerTitle: 'RESOURCES',
    subItems: [
      { label: 'Investor FAQs', path: '/investor-relations/resources/investor-faqs' },
      { label: 'Email Alerts', path: '/investor-relations/resources/email-alerts' },
      { label: 'Contact Us', path: '/investor-relations/resources/contact-us' },
    ],
  },
];

export const getInvestorRelationsTabs = () =>
    investorRelationsTabsBase.map((tab) => {
        if (!Array.isArray(tab.subItems)) return tab;

        return {
            ...tab,
            subItems: tab.subItems.filter((sub) => isIrSubItemVisible(sub)),
        };
    });

/** @deprecated Use getInvestorRelationsTabs() for launch-aware navigation. */
export const investorRelationsTabs = investorRelationsTabsBase;
