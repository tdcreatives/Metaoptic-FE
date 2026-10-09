'use client';

import { useEffect, useRef } from 'react';
import { getTurnstileSiteKey, loadTurnstileScript } from '@/lib/turnstile';

/**
 * Managed Turnstile widget. Calls onToken(token) when solved; onExpire() when token expires.
 */
export default function TurnstileField({ onToken, onExpire, className = '' }) {
    const hostRef = useRef(null);
    const widgetIdRef = useRef(null);
    const siteKey = getTurnstileSiteKey();

    useEffect(() => {
        if (!siteKey || !hostRef.current) {
            return undefined;
        }
        let cancelled = false;

        loadTurnstileScript()
            .then(() => {
                if (cancelled || !hostRef.current || !window.turnstile) return;
                widgetIdRef.current = window.turnstile.render(hostRef.current, {
                    sitekey: siteKey,
                    callback: (token) => onToken?.(token),
                    'expired-callback': () => onExpire?.(),
                    'error-callback': () => onExpire?.(),
                });
            })
            .catch(() => onExpire?.());

        return () => {
            cancelled = true;
            if (widgetIdRef.current != null && window.turnstile?.remove) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
        // intentionally mount once per siteKey
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey]);

    if (!siteKey) {
        return (
            <p className={`text-sm text-red-600 ${className}`} role="alert">
                Captcha is not configured. Please try again later.
            </p>
        );
    }

    return <div ref={hostRef} className={className} />;
}
