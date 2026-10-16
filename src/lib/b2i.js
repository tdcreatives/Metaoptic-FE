const LISTING_ENDPOINT = 'https://www.b2i.us/b2i/LibraryFeed.asp';
const QUOTE_ENDPOINT = 'https://www.b2i.us/b2i/QuoteFeed.asp';
const SEC_ENDPOINT = 'https://www.b2i.us/b2i/SecData2.asp';

const FULL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_ABBR = {
    january: 'JAN', february: 'FEB', march: 'MAR', april: 'APR',
    may: 'MAY', june: 'JUN', july: 'JUL', august: 'AUG',
    september: 'SEP', october: 'OCT', november: 'NOV', december: 'DEC',
};

function formatDate(raw) {
    if (!raw) return '';
    const match = raw.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/);
    if (!match) return raw.trim().toUpperCase();
    const [, month, day, year] = match;
    const abbr = MONTH_ABBR[month.toLowerCase()] || month.slice(0, 3).toUpperCase();
    return `${abbr} ${day.padStart(2, '0')}, ${year}`;
}

export async function fetchPressReleaseList({ bizId, apiKey, count = 3, page = 1, year = '' }) {
    const params = new URLSearchParams({
        b: bizId,
        api: apiKey,
        i: String(count),
        p: String(page),
        sd: '1',
        df: '6',
        tl: '1',
        div: 'LibDiv',
    });
    if (year) params.set('y', String(year));

    const url = `${LISTING_ENDPOINT}?${params.toString()}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`B2I listing ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const items = [];
        const dateCells = doc.querySelectorAll('td.b2iHeadLinesDateCell');

        dateCells.forEach((dateCell) => {
            const dateRaw = dateCell.textContent.replace(/ /g, ' ').trim();

            const idAnchor = dateCell.querySelector('a[id^="Anchor"]');
            const id = idAnchor ? idAnchor.id.replace(/^Anchor/, '') : '';

            const dataRow = dateCell.closest('tr')?.nextElementSibling;
            const headlineLink = dataRow?.querySelector('a.b2iLibraryHeadlineLink');
            if (!headlineLink) return;

            const title = headlineLink.getAttribute('title') || headlineLink.textContent.trim();
            const hrefRaw = headlineLink.getAttribute('href') || '';
            const urlMatch = hrefRaw.match(/OpenApiStory\(['"]([^'"]+)['"]/);
            const storyUrl = urlMatch ? urlMatch[1] : '';

            if (!title || !storyUrl) return;

            items.push({
                id: id || storyUrl,
                title,
                storyUrl,
                dateRaw,
                dateFormatted: formatDate(dateRaw),
            });
        });

        let totalPages = items.length > 0 ? page : 1;
        doc.querySelectorAll('#b2iLibNav a[href*="UpdateApiPage"]').forEach((a) => {
            const m = (a.getAttribute('href') || '').match(/UpdateApiPage\((\d+)/);
            if (m) {
                const n = Number(m[1]);
                if (n > totalPages) totalPages = n;
            }
        });

        const availableYears = [];
        doc.querySelectorAll('select[name="B2iYear"] option').forEach((opt) => {
            const v = (opt.getAttribute('value') || '').trim();
            if (/^\d{4}$/.test(v)) availableYears.push(Number(v));
        });

        return {
            items: items.slice(0, count),
            totalPages,
            currentPage: page,
            availableYears,
        };
    } catch (err) {
        console.error('[b2i] fetchPressReleaseList failed:', err);
        return { items: [], totalPages: 1, currentPage: page, availableYears: [] };
    }
}

function pickText(root, selector) {
    const el = root.querySelector(selector);
    return el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
}

function formatUpdatedAt(raw) {
    if (!raw) return '';
    const match = raw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*([A-Z]{2,3})?/i);
    if (!match) return raw;
    const [, month, day, year, hour, minute, ampm, tz] = match;
    const monthName = FULL_MONTHS[Number(month) - 1] || month;
    const timePart = minute === '00' ? `${hour} ${ampm.toUpperCase()}` : `${hour}:${minute} ${ampm.toUpperCase()}`;
    return `${monthName} ${Number(day)}, ${year} ${timePart}${tz ? ` ${tz.toUpperCase()}` : ''}`;
}

function parseQuoteFormat1(doc) {
    const root = doc.querySelector('.b2iQuoteContent') || doc.body;
    if (!root) return null;

    const exchangeRaw = pickText(root, '.exchange');
    const updateRaw = pickText(root, '.UpdateRow .b2iQuoteSubTxt');
    const updateMatch = updateRaw.match(/Data as of\s*(.+?)(?:Refresh|$)/i);
    const updatedAt = formatUpdatedAt((updateMatch ? updateMatch[1] : updateRaw).trim());

    return {
        exchange: exchangeRaw.replace(/:$/, '').trim(),
        symbol: pickText(root, '.b2iTblTtl .symbol'),
        price: pickText(root, '.LastPriceRow .b2iPrice'),
        changeNet: pickText(root, '.ChangeRow .ChangeNet'),
        changePercent: pickText(root, '.ChangeRow .ChangePercent'),
        volume: pickText(root, '.VolumeRow .b2iQuoteValue'),
        dayRange: pickText(root, '.DayRangeRow .b2iQuoteValue'),
        yearRange: pickText(root, '.YearRangeRow .b2iQuoteValue'),
        marketCap: pickText(root, '.MarketCapRow .b2iQuoteValue'),
        open: pickText(root, '.OpenRow .b2iQuoteValue'),
        previousClose: pickText(root, '.CloseRow .b2iQuoteValue'),
        sharesOutstanding: pickText(root, '.OutstandingRow .b2iQuoteValue'),
        updatedAt,
    };
}

function parseQuoteFormat10(doc) {
    const root = doc.querySelector('.b2iClientQuoteDiv') || doc.body;
    if (!root) return null;

    const fields = {};
    root.querySelectorAll('.b2iClientQuote').forEach((item) => {
        const label = pickText(item, '.b2iClientQuoteLabel');
        const value = pickText(item, '.b2iClientQuoteData');
        if (label) fields[label] = value;
    });

    const todayUpdatedAt = pickText(root, '.b2iClientQuoteHeader .b2iClientQuoteDateTime');

    return {
        today: {
            last: fields['Last'],
            change: fields['Change'],
            changePercent: fields['% Chg'],
            volume: fields['Volume'],
            open: fields['Open'],
            prevClose: fields['Prev. Close'],
            high: fields['High'],
            low: fields['Low'],
            bid: fields['Bid'],
            bidSize: fields['Bid Size'],
            ask: fields['Ask'],
            askSize: fields['Ask Size'],
            updatedAt: todayUpdatedAt,
        },
        shareInfo: {
            yearHigh: fields['Year High'],
            yearLow: fields['Year Low'],
            exchange: fields['Exchange'],
            shares: fields['Shares'],
            marketCap: fields['MarketCap'],
            pbRatio: fields['PB Ratio'],
        },
    };
}

const FILING_GROUPS = [
    { value: '', label: 'All' },
    { value: '10-K', label: 'Annual Reports' },
    { value: '10-Q', label: 'Quarterly Reports' },
    { value: '8-K', label: 'Current Reports' },
    { value: '4', label: 'Insider Transactions (3, 4, 5)' },
    { value: 'F-3', label: 'Registration & Offerings' },
    { value: 'SC', label: 'Acquisition Statements' },
    { value: '424B5', label: 'Prospectus' },
];

function getFilingGroupLabel(form) {
    const f = (form || '').toUpperCase();
    if (/^8-K/.test(f)) return 'Current Reports';
    if (/^(10-K|20-F|40-F)/.test(f)) return 'Annual Reports';
    if (/^(10-Q|6-K)/.test(f)) return 'Quarterly Reports';
    if (/^(3|4|5)(\/|$|\b)/.test(f)) return '3, 4, 5';
    if (/^(DEF|PRE|DEFM|PREM)/.test(f)) return 'Proxy Statements';
    if (/^(S-1|F-1|F-3|S-3|424|DRS)/.test(f)) return 'Registration & Offerings';
    if (/^SC/.test(f)) return 'Acquisition Statements';
    return 'Other';
}

function extractLinkFromImage(row, imageClass) {
    const img = row.querySelector(`img.${imageClass}`);
    if (!img) return '';
    const anchor = img.closest('a');
    if (!anchor) return '';
    const href = anchor.getAttribute('href') || '';
    const openMatch = href.match(/OpenWindow\(['"]([^'"]+)['"]/);
    if (openMatch) return openMatch[1];
    if (href.startsWith('http')) return href;
    return '';
}

export async function fetchSecFilings({ bizId, apiKey, page = 1, year = '', type = '', count = 10 }) {
    const params = new URLSearchParams({
        b: bizId,
        v: '0.9.8',
        api: apiKey,
        p: String(page),
        c: String(count),
        n: '1',
        df: '1',
        sg: '1',
        css: '1',
        div: 'SECdiv',
    });
    if (year) params.set('y', String(year));
    if (type) params.set('t', String(type));

    const url = `${SEC_ENDPOINT}?${params.toString()}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`B2I SEC ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const items = [];
        doc.querySelectorAll('.SecFiling').forEach((row) => {
            const date = pickText(row, '.b2iSecFilingDate');
            const formAnchor = row.querySelector('.b2iSecFilingType .SecLink');
            const form = formAnchor ? formAnchor.textContent.trim() : '';
            const descriptionAnchor = row.querySelector('.b2iSecFilingFormName .SecLink');
            const description = descriptionAnchor
                ? (descriptionAnchor.getAttribute('title') || descriptionAnchor.textContent.trim())
                : '';

            const links = {
                html: extractLinkFromImage(row, 'b2iSecHtmImage'),
                pdf: extractLinkFromImage(row, 'b2iSecPdfImage'),
                doc: extractLinkFromImage(row, 'b2iSecDocImage'),
                xls: extractLinkFromImage(row, 'b2iSecXlsImage'),
                xbrl: extractLinkFromImage(row, 'b2iSecXbrlImage'),
            };

            if (!date && !form) return;
            items.push({
                id: links.html || `${date}-${form}-${items.length}`,
                date,
                form,
                description,
                group: getFilingGroupLabel(form),
                links,
            });
        });

        let totalPages = page;
        doc.querySelectorAll('#b2iSecFilingNav a[href*="UpdatePage"]').forEach((a) => {
            const m = (a.getAttribute('href') || '').match(/UpdatePage\((\d+)/);
            if (m) {
                const n = Number(m[1]);
                if (n > totalPages) totalPages = n;
            }
        });

        const availableYears = [];
        doc.querySelectorAll('select#sYear option').forEach((opt) => {
            const v = (opt.getAttribute('value') || '').trim();
            if (/^\d{4}$/.test(v)) availableYears.push(Number(v));
        });

        return {
            items,
            totalPages,
            currentPage: page,
            availableYears,
            filingGroups: FILING_GROUPS,
        };
    } catch (err) {
        console.error('[b2i] fetchSecFilings failed:', err);
        return { items: [], totalPages: 1, currentPage: page, availableYears: [], filingGroups: FILING_GROUPS };
    }
}

export async function fetchStockQuote({ bizId, apiKey, symbol, format = '1' }) {
    const url = `${QUOTE_ENDPOINT}?b=${encodeURIComponent(bizId)}&sdiv=QuoteDiv&api=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(symbol)}&f=${encodeURIComponent(format)}&d=1&dl=2&css=1`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`B2I quote ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return String(format) === '10' ? parseQuoteFormat10(doc) : parseQuoteFormat1(doc);
    } catch (err) {
        console.error('[b2i] fetchStockQuote failed:', err);
        return null;
    }
}

export async function fetchPressReleaseExcerpt({ storyUrl, maxChars = 220 }) {
    if (!storyUrl) return '';

    try {
        const res = await fetch(storyUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`B2I story ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        let text = '';
        const paragraphs = doc.querySelectorAll('p');
        for (const p of paragraphs) {
            const candidate = p.textContent.replace(/\s+/g, ' ').trim();
            if (candidate.length > 80) { text = candidate; break; }
        }

        if (!text) {
            const bodyText = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim();
            const dashIdx = bodyText.indexOf(' -- ');
            text = dashIdx > -1 ? bodyText.slice(dashIdx + 4) : bodyText;
        }

        text = text.replace(/^[A-Z][A-Za-z .]+,\s+[A-Za-z]+\s+\d{1,2},\s*\d{4}\s*\/[^/]+\/\s*--\s*/, '');

        if (text.length <= maxChars) return text;
        const truncated = text.slice(0, maxChars);
        const lastSpace = truncated.lastIndexOf(' ');
        return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxChars).trimEnd()}…`;
    } catch (err) {
        console.error('[b2i] fetchPressReleaseExcerpt failed:', err);
        return '';
    }
}
