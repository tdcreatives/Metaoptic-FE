import { irApiUrl } from './ir-api-url.js';

export function buildSubscribePayload({ email, first_name, last_name, categories, website, turnstileToken }) {
    return {
        email,
        first_name,
        last_name,
        categories,
        website: website ?? '',
        turnstileToken: turnstileToken ?? '',
    };
}

export function stripUnsubSearch(href) {
    const url = new URL(href);
    url.searchParams.delete('unsub');
    return `${url.pathname}${url.search}${url.hash}`;
}

export async function postSubscribe(fields) {
    const res = await fetch(irApiUrl('/api/subscribers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildSubscribePayload(fields)),
    });
    if (!res.ok) {
        throw new Error(`subscribers API ${res.status}`);
    }
    return res.json();
}

export async function postUnsubscribe(token) {
    const res = await fetch(irApiUrl('/api/unsubscribe'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ token }),
    });
    if (!res.ok) {
        throw new Error(`unsubscribe API ${res.status}`);
    }
    return res.json();
}
