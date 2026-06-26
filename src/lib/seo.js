import metadataJson from '@/constants/metadata.json';

export const SITE_ORIGIN = 'https://metaoptics.sg';
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/images/metaoptics-logo.png`;

export function stripHtmlForMeta(text = '') {
    return String(text)
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function buildPageMetadata({
    title,
    description,
    path,
    keywords,
    image = DEFAULT_OG_IMAGE,
    type = 'website',
}) {
    const url = path.startsWith('http') ? path : `${SITE_ORIGIN}${path}`;

    return {
        title,
        description,
        ...(keywords && { keywords }),
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type,
            siteName: 'Metaoptics Technologies',
            locale: 'en_US',
            images: [image],
        },
        twitter: {
            card: 'summary_large_image',
            site: '@metaoptics',
            creator: '@metaoptics',
            title,
            description,
            images: [image],
        },
    };
}

export function buildPageMetadataFromSection(sectionKey) {
    const meta = metadataJson[sectionKey];
    if (!meta) {
        throw new Error(`Missing metadata section: ${sectionKey}`);
    }

    const path = meta.path || new URL(meta.ogUrl).pathname;

    return buildPageMetadata({
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        path,
        image: meta.ogImage,
    });
}

export function buildIrPageMetadata(pageKey) {
    const meta = metadataJson.irPages[pageKey];
    if (!meta) {
        throw new Error(`Missing IR metadata: ${pageKey}`);
    }

    return buildPageMetadata({
        title: meta.title,
        description: meta.description,
        path: meta.path,
        keywords: metadataJson.investorrelations.keywords,
    });
}

export function buildProductMetadata(product, path) {
    const title = product?.name
        ? `${product.name} | Metaoptics Technologies`
        : 'Product | Metaoptics Technologies';
    const rawDescription =
        product?.details?.description ||
        product?.details?.subtitle ||
        '';
    const description = stripHtmlForMeta(rawDescription).slice(0, 160);
    const image = product?.image ? `${SITE_ORIGIN}${product.image}` : DEFAULT_OG_IMAGE;

    return buildPageMetadata({ title, description, path, image });
}

export function buildNewsMetadata(news) {
    const title = news?.title
        ? `${news.title} | Metaoptics Technologies`
        : 'News | Metaoptics Technologies';
    const description = stripHtmlForMeta(news?.desc || '').slice(0, 160);
    const path = `/news/${news?.slug || ''}`;
    const image = news?.image ? `${SITE_ORIGIN}${news.image}` : DEFAULT_OG_IMAGE;

    return buildPageMetadata({
        title,
        description,
        path,
        image,
        type: 'article',
    });
}
