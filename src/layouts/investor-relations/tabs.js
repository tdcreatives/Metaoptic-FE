export const investorRelationsTabs = [
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
  { label: 'EVENTS & PRESENTATION', path: '/investor-relations/events-and-presentation', bannerTitle: 'EVENTS &<br/>PRESENTATION' },
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
  { label: 'GOVERNANCE', path: '/investor-relations/governance', bannerTitle: 'GOVERNANCE' },
  { label: 'RESOURCES', path: '/investor-relations/resources', bannerTitle: 'RESOURCES' },
];
