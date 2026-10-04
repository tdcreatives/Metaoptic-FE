/**
 * Join NEXT_PUBLIC_IR_API_BASE with an API path.
 *
 * Do not use `new URL('/api/...', base)` — an absolute path drops any
 * subdirectory on the base (e.g. https://metaoptics.sg/backend + /api/x
 * becomes https://metaoptics.sg/api/x).
 */
export function irApiUrl(path) {
    const base = process.env.NEXT_PUBLIC_IR_API_BASE;
    if (!base) {
        throw new Error('NEXT_PUBLIC_IR_API_BASE is not set');
    }
    const root = String(base).trim().replace(/\/+$/, '');
    const suffix = path.startsWith('/') ? path : `/${path}`;
    return root + suffix;
}
