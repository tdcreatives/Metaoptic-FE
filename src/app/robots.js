import { SITE_ORIGIN } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    };
}
