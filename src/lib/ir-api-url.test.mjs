import test from 'node:test';
import assert from 'node:assert/strict';

import { irApiUrl } from './ir-api-url.js';

test('irApiUrl keeps subdirectory on API base', () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://metaoptics.sg/backend';
    try {
        assert.equal(
            irApiUrl('/api/announcements'),
            'https://metaoptics.sg/backend/api/announcements'
        );
        assert.equal(
            irApiUrl('/api/announcements/preview'),
            'https://metaoptics.sg/backend/api/announcements/preview'
        );
        assert.equal(
            irApiUrl('api/subscribers'),
            'https://metaoptics.sg/backend/api/subscribers'
        );
    } finally {
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});

test('irApiUrl trims trailing slash on base', () => {
    const previous = process.env.NEXT_PUBLIC_IR_API_BASE;
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://metaoptics.sg/backend/';
    try {
        assert.equal(
            irApiUrl('/api/unsubscribe'),
            'https://metaoptics.sg/backend/api/unsubscribe'
        );
    } finally {
        if (previous === undefined) {
            delete process.env.NEXT_PUBLIC_IR_API_BASE;
        } else {
            process.env.NEXT_PUBLIC_IR_API_BASE = previous;
        }
    }
});
