import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    announcementStaticParamsFrom,
    fetchAnnouncementBySlug,
    fetchAnnouncementList,
    fetchAnnouncementPreview,
    mapApiAnnouncementToLegacy,
} from './announcements-api.js';
import {
    FORBIDDEN_KEYS,
    LEGACY_KEYS,
    LIST_KEYS,
    syntheticPresenterRow,
} from '../../scripts/check-announcement-api-parity.mjs';
import { parseAnnouncementDate } from '../utils/announcements.js';

const apiRow = {
    id: 9,
    slug: 'mou-sg25010100abcde',
    title: 'MetaOptics Enters MOU',
    category: 'General Announcement',
    issuer: 'MetaOptics Ltd',
    filed_at: '2025-09-15T09:30:00+08:00',
    source_url: 'https://example.test/x',
    summary: 'Short',
    published_at: '2025-09-15T10:00:00+08:00',
};

test('mapApiAnnouncementToLegacy preserves slug and category', () => {
    const legacy = mapApiAnnouncementToLegacy(apiRow);
    assert.equal(legacy.slug, 'mou-sg25010100abcde');
    assert.equal(legacy.category, 'General Announcement');
    assert.ok(legacy.date);
});

test('mapApiAnnouncementToLegacy formats filed_at as SG-style date in Asia/Singapore', () => {
    const legacy = mapApiAnnouncementToLegacy(apiRow);
    assert.equal(legacy.date, '15 Sep 2025 9:30 AM');
    assert.ok(parseAnnouncementDate(legacy.date) > 0);
});

test('mapApiAnnouncementToLegacy never uses slug as SGX reference', () => {
    const legacy = mapApiAnnouncementToLegacy({
        id: 67,
        slug: 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
        title: 'X',
        category: 'General Announcement',
        filed_at: '2026-09-11T20:43:00+08:00',
        details: {
            announcement: { reference: 'SG260911OTHR4TNS', subTitle: 'Press', title: 'General Announcement' },
            issuer: { name: 'METAOPTICS LTD' },
            attachments: [],
        },
        title_banner: 'GENERAL<br/>ANNOUNCEMENT',
        title_btn: 'X',
        title_btn_sm: 'X',
        desc: '',
        date: '11 Sep 2026 8:43 PM',
    });
    assert.equal(legacy.details.announcement.reference, 'SG260911OTHR4TNS');
    assert.equal(legacy.title_banner, 'GENERAL<br/>ANNOUNCEMENT');
});

test('mapApiAnnouncementToLegacy flat map uses ann_reference not slug', () => {
    const legacy = mapApiAnnouncementToLegacy({
        ...apiRow,
        ann_reference: 'SG25010100ABCDE',
    });
    assert.equal(legacy.details.announcement.reference, 'SG25010100ABCDE');
    assert.notEqual(legacy.details.announcement.reference, legacy.slug);
});

test('fetchAnnouncementList reads NEXT_PUBLIC_IR_API_BASE and query params', async () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://metaoptics.sg/backend';
    const calls = [];
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        calls.push({ url: String(url), init });
        return {
            ok: true,
            json: async () => ({ data: [apiRow], meta: { page: 1, page_size: 50, total: 1 } }),
        };
    };

    try {
        const payload = await fetchAnnouncementList({ page: 2, pageSize: 20, category: 'Placements', q: 'MOU' });
        assert.equal(payload.data.length, 1);
        assert.equal(calls.length, 1);
        const requested = new URL(calls[0].url);
        assert.equal(requested.origin, 'https://metaoptics.sg');
        assert.equal(requested.pathname, '/backend/api/announcements');
        assert.equal(requested.searchParams.get('page'), '2');
        assert.equal(requested.searchParams.get('page_size'), '20');
        assert.equal(requested.searchParams.get('category'), 'Placements');
        assert.equal(requested.searchParams.get('q'), 'MOU');
    } finally {
        globalThis.fetch = previousFetch;
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});

test('fetchAnnouncementList without page follows meta.total across pages', async () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://ir-api.example.test';
    const calls = [];
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async (url) => {
        const requested = new URL(String(url));
        const page = requested.searchParams.get('page');
        calls.push(page);
        const data = page === '1'
            ? [{ ...apiRow, id: 1, slug: 'a' }, { ...apiRow, id: 2, slug: 'b' }]
            : [{ ...apiRow, id: 3, slug: 'c' }];
        return {
            ok: true,
            json: async () => ({ data, meta: { page: Number(page), page_size: 2, total: 3 } }),
        };
    };

    try {
        const payload = await fetchAnnouncementList({ pageSize: 2 });
        assert.deepEqual(calls, ['1', '2']);
        assert.equal(payload.data.length, 3);
        assert.equal(payload.meta.total, 3);
        assert.deepEqual(payload.data.map((row) => row.slug), ['a', 'b', 'c']);
    } finally {
        globalThis.fetch = previousFetch;
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});

test('JSON fixture list items have FE list keys', () => {
    const jsonPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../constants/announcements.json');
    const items = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    assert.ok(Array.isArray(items) && items.length > 0);
    for (const item of items) {
        for (const key of LIST_KEYS) {
            assert.ok(Object.hasOwn(item, key), `list item ${item.id} missing ${key}`);
        }
    }
});

test('synthetic Presenter row maps to legacy FE keys without forbidden fields', () => {
    const row = syntheticPresenterRow();
    const legacy = mapApiAnnouncementToLegacy(row);
    for (const key of LEGACY_KEYS) {
        assert.ok(legacy[key] != null, `mapped legacy missing ${key}`);
    }
    for (const key of FORBIDDEN_KEYS) {
        assert.equal(Object.hasOwn(legacy, key), false, `mapped legacy must not include ${key}`);
    }
});

test('announcementStaticParamsFrom unions API slugs when includeApi', async () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://ir-api.example.test';
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({
            data: [{ ...apiRow, slug: 'api-only-slug' }, { ...apiRow, slug: 'mou-sg25010100abcde' }],
            meta: { page: 1, page_size: 100, total: 2 },
        }),
    });

    try {
        const jsonOnly = await announcementStaticParamsFrom(
            [{ slug: 'mou-sg25010100abcde' }, { slug: 'dup' }, { slug: 'dup' }],
            { includeApi: false }
        );
        assert.deepEqual(jsonOnly, [{ slug: 'mou-sg25010100abcde' }, { slug: 'dup' }]);

        const merged = await announcementStaticParamsFrom([{ slug: 'mou-sg25010100abcde' }], {
            includeApi: true,
        });
        assert.deepEqual(
            merged.map((p) => p.slug).sort(),
            ['api-only-slug', 'mou-sg25010100abcde']
        );
    } finally {
        globalThis.fetch = previousFetch;
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});

test('fetchAnnouncementBySlug GETs /api/announcements/{slug}', async () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://ir-api.example.test';
    const calls = [];
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        calls.push({ url: String(url), init });
        return {
            ok: true,
            json: async () => ({ data: apiRow }),
        };
    };

    try {
        const row = await fetchAnnouncementBySlug(apiRow.slug);
        assert.equal(row.slug, apiRow.slug);
        assert.equal(calls.length, 1);
        const requested = new URL(calls[0].url);
        assert.equal(requested.origin, 'https://ir-api.example.test');
        assert.equal(requested.pathname, `/api/announcements/${apiRow.slug}`);
    } finally {
        globalThis.fetch = previousFetch;
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});

test('fetchAnnouncementPreview GETs /api/announcements/preview?t=', async () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://ir-api.example.test';
    const calls = [];
    const previousFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        calls.push({ url: String(url), init });
        return {
            ok: true,
            json: async () => ({ data: apiRow, meta: { preview: true, state: 'pending_review' } }),
        };
    };

    try {
        const payload = await fetchAnnouncementPreview('1.9999999999.abcdef');
        assert.equal(payload.data.slug, apiRow.slug);
        assert.equal(payload.meta.preview, true);
        assert.equal(calls.length, 1);
        const requested = new URL(calls[0].url);
        assert.equal(requested.pathname, '/api/announcements/preview');
        assert.equal(requested.searchParams.get('t'), '1.9999999999.abcdef');
        assert.equal(calls[0].init?.cache, 'no-store');
    } finally {
        globalThis.fetch = previousFetch;
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});
