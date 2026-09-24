import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSubscribePayload, stripUnsubSearch } from './subscribe-api.js';

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

test('stripUnsubSearch removes unsub token and keeps other params', () => {
    assert.equal(
        stripUnsubSearch('https://metaoptics.sg/investor-relations/resources/email-alerts?unsub=abc&x=1#top'),
        '/investor-relations/resources/email-alerts?x=1#top'
    );
    assert.equal(
        stripUnsubSearch('https://metaoptics.sg/investor-relations/resources/email-alerts?unsub=abc'),
        '/investor-relations/resources/email-alerts'
    );
});
