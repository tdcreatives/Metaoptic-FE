const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

export function getTurnstileSiteKey() {
    return String(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '').trim();
}

export function loadTurnstileScript() {
    if (typeof window === 'undefined') {
        return Promise.resolve();
    }
    if (window.turnstile) {
        return Promise.resolve();
    }
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('Turnstile script failed')), {
                once: true,
            });
        });
    }
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.id = SCRIPT_ID;
        s.src = SCRIPT_SRC;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Turnstile script failed'));
        document.head.appendChild(s);
    });
}
