const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatFiledAt(filedAt) {
    const normalized = String(filedAt ?? '').replace(
        /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})([+-]\d{2}:\d{2}|Z)?$/,
        (_, date, time, zone) => `${date}T${time}${zone || ''}`
    );
    const filed = new Date(normalized);
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
    if (row?.details?.announcement) {
        return {
            ...row,
            id: String(row.id),
            date: row.date || formatFiledAt(row.filed_at),
            desc: row.desc ?? row.summary ?? '',
            details: {
                ...row.details,
                announcement: { ...row.details.announcement },
            },
        };
    }

    const reference = row.ann_reference || row.sgx_reference || '';
    return {
        id: String(row.id),
        slug: row.slug,
        category: row.category,
        title: row.title,
        desc: row.summary || '',
        date: row.date || formatFiledAt(row.filed_at),
        url: row.source_url || '',
        title_banner: row.title_banner,
        title_btn: row.title_btn,
        title_btn_sm: row.title_btn_sm,
        details: {
            announcement: {
                reference,
                subTitle: row.title,
                submittedBy: row.issuer || '',
                description: row.summary || '',
            },
        },
    };
}

async function fetchAnnouncementPage({ page = 1, pageSize = 50, category, q } = {}) {
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

/** Omit `page` to follow pages until meta.total is collected (API page_size is capped). */
export async function fetchAnnouncementList({ page, pageSize = 50, category, q } = {}) {
    if (page != null) {
        return fetchAnnouncementPage({ page, pageSize, category, q });
    }

    const first = await fetchAnnouncementPage({ page: 1, pageSize, category, q });
    const rows = [...(first.data || [])];
    const total = Number(first.meta?.total ?? rows.length);
    const size = Math.max(1, Number(first.meta?.page_size ?? pageSize) || pageSize);
    const maxPages = Math.max(1, Math.ceil(total / size) + 1);
    let currentPage = 1;

    while (rows.length < total && currentPage < maxPages) {
        currentPage += 1;
        const next = await fetchAnnouncementPage({ page: currentPage, pageSize, category, q });
        const chunk = next.data || [];
        if (chunk.length === 0) {
            break;
        }
        rows.push(...chunk);
    }

    return {
        data: rows,
        meta: { ...(first.meta || {}), page: 1, page_size: size, total },
    };
}

export async function fetchAnnouncementBySlug(slug) {
    const base = process.env.NEXT_PUBLIC_IR_API_BASE;
    if (!base) {
        throw new Error('NEXT_PUBLIC_IR_API_BASE is not set');
    }

    const url = new URL(`/api/announcements/${encodeURIComponent(slug)}`, base);
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
        throw new Error(`announcements API ${res.status}`);
    }
    const payload = await res.json();
    return payload.data ?? payload;
}
