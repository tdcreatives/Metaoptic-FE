import test from 'node:test';
import assert from 'node:assert/strict';
import { postContact } from './contact-api.js';

test('postContact POSTs JSON to /api/contact and maps errors', async () => {
    process.env.NEXT_PUBLIC_IR_API_BASE = 'https://example.test/backend';
    const seen = [];
    const orig = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        seen.push({ url, init });
        return {
            ok: false,
            json: async () => ({ ok: false, error: 'Please complete the captcha and try again.' }),
        };
    };
    try {
        const result = await postContact({
            channel: 'main',
            turnstileToken: '',
            fullName: 'A',
            email: 'a@example.com',
            phone: '1',
            subject: 's',
            message: 'm',
        });
        assert.equal(result.ok, false);
        assert.equal(result.error, 'Please complete the captcha and try again.');
        assert.equal(seen[0].url, 'https://example.test/backend/api/contact');
        assert.equal(seen[0].init.method, 'POST');
        const body = JSON.parse(seen[0].init.body);
        assert.equal(body.channel, 'main');
        assert.equal(body.turnstileToken, '');
    } finally {
        globalThis.fetch = orig;
    }
});
