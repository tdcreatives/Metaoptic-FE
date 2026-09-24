export function buildSubscribePayload({ email, first_name, last_name, categories, website }) {
    return {
        email,
        first_name,
        last_name,
        categories,
        website: website ?? '',
    };
}

function irApiUrl(path) {
    const base = process.env.NEXT_PUBLIC_IR_API_BASE;
    if (!base) {
        throw new Error('NEXT_PUBLIC_IR_API_BASE is not set');
    }
    return new URL(path, base).toString();
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
