import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSubscribePayload } from './subscribe-api.js';

test('buildSubscribePayload includes empty honeypot', () => {
    const payload = buildSubscribePayload({
        email: 'investor@example.com',
        first_name: 'Ada',
        last_name: 'Lovelace',
        categories: ['General Announcement'],
    });
    assert.equal(payload.website, '');
    assert.equal(payload.email, 'investor@example.com');
    assert.deepEqual(payload.categories, ['General Announcement']);
});
