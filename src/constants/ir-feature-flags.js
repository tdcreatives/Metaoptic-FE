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
    showStockInfo: false,
    showAnalystCoverage: true,
    showQuarterlyResults: false,
    showDocumentsAndCharters: false,
};

/** Parent redirect when Stock Info (entire section) is hidden */
export const IR_STOCK_INFO_FALLBACK = '/investor-relations';

const SUB_ITEM_VISIBILITY = {
    '/investor-relations/stock-info/analyst-coverage': 'showAnalystCoverage',
    '/investor-relations/financials/quarterly-results': 'showQuarterlyResults',
    '/investor-relations/governance/documents-and-charters': 'showDocumentsAndCharters',
};

const STOCK_INFO_PATH_PREFIX = '/investor-relations/stock-info';

export const isStockInfoPath = (pathname) =>
    pathname === STOCK_INFO_PATH_PREFIX || pathname.startsWith(`${STOCK_INFO_PATH_PREFIX}/`);

export const isIrTabVisible = (tab) => {
    if (tab.launchFlag && !IR_LAUNCH_FLAGS[tab.launchFlag]) {
        return false;
    }
    return true;
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

export const getDefaultStockInfoPath = () =>
    IR_LAUNCH_FLAGS.showStockInfo
        ? '/investor-relations/stock-info/stock-quote'
        : IR_STOCK_INFO_FALLBACK;

export const getDefaultGovernancePath = () =>
    IR_LAUNCH_FLAGS.showDocumentsAndCharters
        ? '/investor-relations/governance/documents-and-charters'
        : '/investor-relations/governance/board-of-directors';

/** Standalone SGX page: /analyst-coverage */
export const getStandaloneAnalystCoverageRedirect = () => IR_STOCK_INFO_FALLBACK;

/** IR sub-page under Stock Info: /investor-relations/stock-info/analyst-coverage */
export const getIrStockInfoAnalystCoverageRedirect = () => {
    if (!IR_LAUNCH_FLAGS.showStockInfo) {
        return IR_STOCK_INFO_FALLBACK;
    }
    return '/investor-relations/stock-info/stock-quote';
};

export const IR_HIDDEN_PAGE_REDIRECTS = {
    '/investor-relations/stock-info': IR_STOCK_INFO_FALLBACK,
    '/investor-relations/stock-info/stock-quote': IR_STOCK_INFO_FALLBACK,
    '/investor-relations/stock-info/analyst-coverage': IR_STOCK_INFO_FALLBACK,
    '/investor-relations/financials/quarterly-results': '/investor-relations/financials/sec-filings',
    '/investor-relations/governance/documents-and-charters': '/investor-relations/governance/board-of-directors',
    '/analyst-coverage': IR_STOCK_INFO_FALLBACK,
};

export const getIrHiddenPageRedirect = (pathname) => {
    if (!IR_LAUNCH_FLAGS.showStockInfo && isStockInfoPath(pathname)) {
        return IR_STOCK_INFO_FALLBACK;
    }

    if (pathname === '/investor-relations/stock-info/analyst-coverage') {
        if (!IR_LAUNCH_FLAGS.showStockInfo || !IR_LAUNCH_FLAGS.showAnalystCoverage) {
            return getIrStockInfoAnalystCoverageRedirect();
        }
    }

    if (pathname === '/investor-relations/financials/quarterly-results' && !IR_LAUNCH_FLAGS.showQuarterlyResults) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    if (pathname === '/investor-relations/governance/documents-and-charters' && !IR_LAUNCH_FLAGS.showDocumentsAndCharters) {
        return IR_HIDDEN_PAGE_REDIRECTS[pathname];
    }
    if (pathname === '/analyst-coverage' && !IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return getStandaloneAnalystCoverageRedirect();
    }
    return null;
};
