import announcements from '@/constants/announcements.json';
import newsData from '@/constants/news.json';
import { SITE_ORIGIN } from '@/lib/seo';
import {
    developmentKitsSlugs,
    equipmentSlugs,
    foundrySlugs,
    productSlugs,
} from '@/utils/product';

export const dynamic = 'force-static';

const MOD = process.env.NEXT_PUBLIC_MOD || 'production';

const shouldIncludeNewsItem = (item) =>
    MOD === 'development' || !item.mod || item.mod === 'production';

const STATIC_PATHS = [
    '',
    '/about-us',
    '/contact-us',
    '/news',
    '/privacy-policy',
    '/verticals',
    '/investor-relations',
    '/company-announcement',
    '/analyst-coverage',
    '/verticals/metalens-foundry',
    '/verticals/metalens-products',
    '/verticals/metalens-capital-equipment',
    '/verticals/metaoptics-ai',
    '/verticals/metalens-products/development-kits',
    '/verticals/metalens-foundry/4in-12in-platforms',
    '/verticals/metalens-foundry/co-packaged-optics',
    '/investor-relations/events-and-presentation',
    '/investor-relations/financials/sec-filings',
    '/investor-relations/financials/quarterly-results',
    '/investor-relations/governance/board-of-directors',
    '/investor-relations/governance/management-team',
    '/investor-relations/governance/committee-composition',
    '/investor-relations/governance/documents-and-charters',
    '/investor-relations/news/press-releases',
    '/investor-relations/news/media',
    '/investor-relations/resources/investor-faqs',
    '/investor-relations/resources/email-alerts',
    '/investor-relations/resources/contact-us',
    '/investor-relations/stock-info/stock-quote',
    '/investor-relations/stock-info/analyst-coverage',
];

export default function sitemap() {
    const productPaths = [
        ...equipmentSlugs.map((slug) => `/verticals/metalens-capital-equipment/${slug}`),
        ...foundrySlugs.map((slug) => `/verticals/metalens-foundry/${slug}`),
        ...productSlugs.map((slug) => `/verticals/metalens-products/${slug}`),
        ...developmentKitsSlugs.map(
            (slug) => `/verticals/metalens-products/development-kits/${slug}`
        ),
    ];

    const newsPaths = newsData.news
        .filter(shouldIncludeNewsItem)
        .map((item) => `/news/${item.slug}`);

    const announcementPaths = announcements.map(
        (item) => `/company-announcement/${item.slug}`
    );

    const allPaths = [...STATIC_PATHS, ...productPaths, ...newsPaths, ...announcementPaths];

    return allPaths.map((path) => ({
        url: `${SITE_ORIGIN}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path.startsWith('/news') ? 0.7 : 0.8,
    }));
}
