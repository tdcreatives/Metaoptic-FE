const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatFiledAt(filedAt) {
    const filed = new Date(filedAt);
    if (Number.isNaN(filed.getTime())) return '';

    const parts = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Singapore',
    }).formatToParts(filed);

    const get = (type) => parts.find((part) => part.type === type)?.value || '';
    const month = MONTHS[Number(get('month')) - 1] || get('month').slice(0, 3);
    const dayPeriod = get('dayPeriod').replace(/\./g, '').toUpperCase();

    return `${get('day')} ${month} ${get('year')} ${get('hour')}:${get('minute')} ${dayPeriod}`;
}

export function mapApiAnnouncementToLegacy(row) {
    return {
        id: String(row.id),
        slug: row.slug,
        category: row.category,
        title: row.title,
        desc: row.summary || '',
        date: formatFiledAt(row.filed_at),
        url: row.source_url || '',
        details: {
            announcement: {
                reference: row.slug,
                subTitle: row.title,
                submittedBy: row.issuer || '',
                description: row.summary || '',
            },
        },
    };
}

export async function fetchAnnouncementList({ page = 1, pageSize = 50, category, q } = {}) {
    const base = process.env.NEXT_PUBLIC_IR_API_BASE;
    if (!base) {
        throw new Error('NEXT_PUBLIC_IR_API_BASE is not set');
    }

    const url = new URL('/api/announcements', base);
    url.searchParams.set('page', String(page));
    url.searchParams.set('page_size', String(pageSize));
    if (category) url.searchParams.set('category', category);
    if (q) url.searchParams.set('q', q);

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
        throw new Error(`announcements API ${res.status}`);
    }
    return res.json();
}
