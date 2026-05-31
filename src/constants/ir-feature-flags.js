/**
 * IR launch visibility flags.
 * Set a flag to true when the section/page is ready to go live.
 *
 * When toggling page-level flags, also update .htaccess IR launch redirect rules
 * so direct URLs redirect at the server (Apache) without a client-side flash.
 */
export const IR_LAUNCH_FLAGS = {
    showMostRecentEvents: false,
    showLatestFinancialResults: false,
    showUpcomingEvents: false,
    showPastEvents: false,
    showAnalystCoverage: true,
    showQuarterlyResults: false,
    showDocumentsAndCharters: false,
};

const SUB_ITEM_VISIBILITY = {
    '/investor-relations/stock-info/analyst-coverage': 'showAnalystCoverage',
    '/investor-relations/financials/quarterly-results': 'showQuarterlyResults',
    '/investor-relations/governance/documents-and-charters': 'showDocumentsAndCharters',
};

export const isIrSubItemVisible = (sub) => {
    if (sub.launchFlag && !IR_LAUNCH_FLAGS[sub.launchFlag]) {
        return false;
    }

    const path = typeof sub === 'string' ? sub : sub.path;
    const basePath = path.split('#')[0];
    const flagKey = SUB_ITEM_VISIBILITY[basePath];
    if (!flagKey) return true;
    return IR_LAUNCH_FLAGS[flagKey];
};

export const getDefaultGovernancePath = () =>
    IR_LAUNCH_FLAGS.showDocumentsAndCharters
        ? '/investor-relations/governance/documents-and-charters'
        : '/investor-relations/governance/board-of-directors';

export const IR_HIDDEN_PAGE_REDIRECTS = {
    '/investor-relations/stock-info/analyst-coverage': '/investor-relations/stock-info/stock-quote',
    '/investor-relations/financials/quarterly-results': '/investor-relations/financials/sec-filings',
    '/investor-relations/governance/documents-and-charters': '/investor-relations/governance/board-of-directors',
    '/analyst-coverage': '/investor-relations/stock-info/stock-quote',
};

export const getIrHiddenPageRedirect = (pathname) => {
    if (pathname === '/investor-relations/stock-info/analyst-coverage' && !IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    if (pathname === '/investor-relations/financials/quarterly-results' && !IR_LAUNCH_FLAGS.showQuarterlyResults) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    if (pathname === '/investor-relations/governance/documents-and-charters' && !IR_LAUNCH_FLAGS.showDocumentsAndCharters) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    if (pathname === '/analyst-coverage' && !IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    return null;
};
