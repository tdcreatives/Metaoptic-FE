import test from 'node:test';
import assert from 'node:assert/strict';
import {
    fetchAnnouncementBySlug,
    fetchAnnouncementList,
    mapApiAnnouncementToLegacy,
} from './announcements-api.js';
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
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://ir-api.example.test';
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
        assert.equal(requested.origin, 'https://ir-api.example.test');
        assert.equal(requested.pathname, '/api/announcements');
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
