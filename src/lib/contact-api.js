import { irApiUrl } from './ir-api-url.js';

export async function postContact(body) {
    try {
        const res = await fetch(irApiUrl('/api/contact'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
            return {
                ok: false,
                error: data.error || 'Something went wrong. Please try again later.',
            };
        }
        return { ok: true };
    } catch {
        return {
            ok: false,
            error: 'Something went wrong. Please try again later.',
        };
    }
}
