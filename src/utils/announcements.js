export const ANNOUNCEMENT_CATEGORIES = [
    'General Announcement',
    'Disclosure of Interest',
    'Placements',
    'Personnel Changes',
    'Annual Reports',
    'AGM / EGM',
    'Equity & Listing',
];

export const ITEMS_PER_PAGE = 10;

export const parseAnnouncementDate = (value) => {
    if (!value) return 0;

    const match = value.match(/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})\s(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (match) {
        const [, day, monthText, year, hourText, minuteText, meridiemText] = match;
        const monthMap = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        };

        const month = monthMap[monthText];
        if (month !== undefined) {
            const meridiem = meridiemText.toUpperCase();
            let hour = Number(hourText);
            const minute = Number(minuteText);

            if (hour <= 12) {
                if (meridiem === 'AM' && hour === 12) hour = 0;
                if (meridiem === 'PM' && hour < 12) hour += 12;
            }

            return new Date(Number(year), month, Number(day), hour, minute).getTime();
        }
    }

    const fallbackTime = new Date(value).getTime();
    return Number.isNaN(fallbackTime) ? 0 : fallbackTime;
};

export const splitAnnouncementDate = (value) => {
    if (!value) return { filingDate: '', filingTime: '' };

    const match = value.match(/^(\d{1,2}\s[A-Za-z]{3}\s\d{4})\s+(\d{1,2}:\d{2}\s(?:AM|PM))$/i);
    if (match) {
        return { filingDate: match[1], filingTime: match[2] };
    }

    return { filingDate: value, filingTime: '' };
};

export const normalizeAnnouncement = (item) => {
    const { filingDate, filingTime } = splitAnnouncementDate(item.date);
    const displayTitle =
        item.details?.announcement?.subTitle ||
        item.title.replace(/::/g, ' - ');

    return {
        id: item.id,
        slug: item.slug,
        category: item.category || 'General Announcement',
        filingDate,
        filingTime,
        displayTitle,
        timestamp: parseAnnouncementDate(item.date),
        searchText: `${displayTitle} ${item.title}`.toLowerCase(),
    };
};

export const getCategoryCounts = (items) => {
    const counts = Object.fromEntries(ANNOUNCEMENT_CATEGORIES.map((c) => [c, 0]));
    items.forEach((item) => {
        const category = item.category || 'General Announcement';
        if (counts[category] !== undefined) {
            counts[category] += 1;
        }
    });
    return counts;
};

export const filterAnnouncements = (items, { search = '', dateFrom = '', dateTo = '', categories = [] } = {}) => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
        const normalized = normalizeAnnouncement(item);

        if (normalizedSearch && !normalized.searchText.includes(normalizedSearch)) {
            return false;
        }

        if (categories.length > 0 && !categories.includes(normalized.category)) {
            return false;
        }

        if (dateFrom || dateTo) {
            const ts = normalized.timestamp;
            if (!ts) return false;

            if (dateFrom) {
                const fromTs = new Date(`${dateFrom}T00:00:00`).getTime();
                if (ts < fromTs) return false;
            }

            if (dateTo) {
                const toTs = new Date(`${dateTo}T23:59:59`).getTime();
                if (ts > toTs) return false;
            }
        }

        return true;
    });
};

export const sortAnnouncements = (items) =>
    [...items].sort((a, b) => parseAnnouncementDate(b.date) - parseAnnouncementDate(a.date));
