const LISTING_ENDPOINT = 'https://www.b2i.us/b2i/LibraryFeed.asp';
const QUOTE_ENDPOINT = 'https://www.b2i.us/b2i/QuoteFeed.asp';

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

export async function fetchStockQuote({ bizId, apiKey, symbol }) {
    const url = `${QUOTE_ENDPOINT}?b=${encodeURIComponent(bizId)}&sdiv=QuoteDiv&api=${encodeURIComponent(apiKey)}&s=${encodeURIComponent(symbol)}&f=1&d=1&dl=2&css=1`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`B2I quote ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
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
            updatedAt,
        };
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
