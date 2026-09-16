import { isIrSubItemVisible, isIrTabVisible } from '@/constants/ir-feature-flags';

const investorRelationsTabsBase = [
  { label: 'OVERVIEW', path: '/investor-relations', bannerTitle: 'INVESTOR<br/>RELATIONS' },
  {
    label: 'EVENTS & PRESENTATION',
    path: '/investor-relations/events-and-presentation',
    bannerTitle: 'EVENTS &amp;<br/>PRESENTATION',
    subItems: [
      { label: 'Investor Presentation', path: '/investor-relations/events-and-presentation#investor-presentation' },
      { label: 'Upcoming Events', path: '/investor-relations/events-and-presentation#upcoming-events', launchFlag: 'showUpcomingEvents' },
      { label: 'Past Events', path: '/investor-relations/events-and-presentation#past-events', launchFlag: 'showPastEvents' },
    ],
  },
  {
    label: 'SGX COMPANY ANNOUNCEMENT',
    path: '/investor-relations/company-announcement',
    bannerTitle: 'INVESTOR<br/>RELATIONS(SGX)',
  },
  {
    label: 'ANALYST COVERAGE',
    path: '/investor-relations/analyst-coverage',
    bannerTitle: 'ANALYST COVERAGE',
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
      { label: 'Contact Us', path: '/investor-relations/resources/contact-us' },
    ],
  },
];

export const getInvestorRelationsTabs = () =>
    investorRelationsTabsBase
        .filter((tab) => isIrTabVisible(tab))
        .map((tab) => {
        if (!Array.isArray(tab.subItems)) return tab;

        return {
            ...tab,
            subItems: tab.subItems.filter((sub) => isIrSubItemVisible(sub)),
        };
    });

/** @deprecated Use getInvestorRelationsTabs() for launch-aware navigation. */
export const investorRelationsTabs = investorRelationsTabsBase;
