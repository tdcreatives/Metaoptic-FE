#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapApiAnnouncementToLegacy } from '../src/lib/announcements-api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'src/constants/announcements.json');

export const LIST_KEYS = ['id', 'slug', 'title', 'category', 'date', 'desc'];
export const LEGACY_KEYS = ['id', 'slug', 'title', 'category', 'date', 'desc', 'details'];
export const FORBIDDEN_KEYS = ['source_payload', 'source_hash', 'needs_review'];

export function syntheticPresenterRow() {
    return {
        id: 99,
        title: 'GENERAL ANNOUNCEMENT::SYNTHETIC PARITY',
        title_btn: 'GENERAL ANNOUNCEMENT::SYNTHETIC PARITY',
        title_btn_sm: 'GENERAL ANNOUNCEMENT::SYNTHETIC PARITY',
        title_banner: 'GENERAL<br/>ANNOUNCEMENT',
        slug: 'synthetic-presenter-parity',
        desc: 'Synthetic Presenter row',
        date: '01 Oct 2026 7:00 AM',
        category: 'General Announcement',
        details: {
            announcement: {
                reference: 'SG261001SYNTH01',
                subTitle: 'Synthetic parity',
                title: 'General Announcement',
            },
        },
    };
}

function requireKeys(obj, keys, label) {
    for (const key of keys) {
        if (obj[key] == null) {
            throw new Error(`${label} missing ${key}`);
        }
    }
}

export function checkAnnouncementApiParity(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('announcements.json must be a non-empty array');
    }
    for (const item of items) {
        for (const key of LIST_KEYS) {
            if (!Object.hasOwn(item, key)) {
                throw new Error(`list item ${item.id ?? '?'} missing ${key}`);
            }
        }
    }

    const legacy = mapApiAnnouncementToLegacy(syntheticPresenterRow());
    requireKeys(legacy, LEGACY_KEYS, 'mapped legacy');
    for (const key of FORBIDDEN_KEYS) {
        if (Object.hasOwn(legacy, key)) {
            throw new Error(`mapped legacy must not include ${key}`);
        }
    }

    return `Pass: ${items.length} JSON rows have list keys; synthetic Presenter maps to legacy FE keys (forbidden keys absent).`;
}

function isDirectRun() {
    const entry = process.argv[1];
    if (!entry) return false;
    return path.resolve(entry) === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
    try {
        const items = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
        console.log(checkAnnouncementApiParity(items));
    } catch (err) {
        console.error(err.message || err);
        process.exit(1);
    }
}
