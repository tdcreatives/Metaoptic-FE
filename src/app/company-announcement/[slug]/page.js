import React from 'react';

import metadataJson from '@/constants/metadata.json';
import items from '@/constants/announcements.json';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import {
    announcementStaticParamsFrom,
    fetchAnnouncementBySlug,
    mapApiAnnouncementToLegacy,
} from '@/lib/announcements-api';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import AnnouncementDetailContent from '@/layouts/investor-relations/announcement-detail-content';
import AnnouncementBanner from '@/layouts/investor-relations/announcement-banner';

const baseMeta = metadataJson.companyAnnouncements;
const SITE_ORIGIN = 'https://metaoptics.sg';

const fromJson = (slug) => items.find((item) => item.slug === slug);

async function loadAnnouncement(slug) {
    if (!IR_LAUNCH_FLAGS.useAnnouncementsApi) {
        return fromJson(slug);
    }
    try {
        return mapApiAnnouncementToLegacy(await fetchAnnouncementBySlug(slug));
    } catch {
        return fromJson(slug);
    }
}

const formatAnnouncementTitle = (announcement) => {
    const subTitle = announcement?.details?.announcement?.subTitle;
    if (subTitle) {
        return `${subTitle} | Metaoptics Technologies`;
    }

    return `${announcement.title.replace(/::/g, ' - ')} | Metaoptics Technologies`;
};

const getAnnouncementDescription = (announcement) => {
    if (announcement?.desc) {
        return announcement.desc;
    }

    const subTitle = announcement?.details?.announcement?.subTitle;
    if (subTitle) {
        return subTitle;
    }

    const description = announcement?.details?.announcement?.description;
    if (description) {
        return description.replace(/\s+/g, ' ').trim().slice(0, 160);
    }

    return baseMeta.description;
};

export async function generateStaticParams() {
    return announcementStaticParamsFrom(items, {
        includeApi: IR_LAUNCH_FLAGS.useAnnouncementsApi,
    });
}

export async function generateMetadata(props) {
    const params = await props.params;
    const announcement = await loadAnnouncement(params.slug);

    if (!announcement) {
        return {
            title: baseMeta.title,
            description: baseMeta.description,
        };
    }

    const title = formatAnnouncementTitle(announcement);
    const description = getAnnouncementDescription(announcement);
    const url = `${SITE_ORIGIN}/company-announcement/${announcement.slug}`;

    return {
        title,
        description,
        keywords: baseMeta.keywords,
        openGraph: {
            title,
            description,
            images: [baseMeta.ogImage],
            url,
            type: baseMeta.ogType,
            siteName: baseMeta.ogSiteName,
            locale: baseMeta.ogLocale,
        },
        twitter: {
            card: baseMeta.twitterCard,
            creator: baseMeta.twitterCreator,
            site: baseMeta.twitterSite,
            title,
            description,
        },
    };
}

const CompanyAnnouncementDetail = async (props) => {
    const params = await props.params;
    const announcement = await loadAnnouncement(params.slug);
    return (
        <>
            <Header />
            <AnnouncementBanner bannerTitle={announcement?.title_banner} />
            <AnnouncementDetailContent announcement={announcement} />
            <Footer />
        </>
    );
};

export default CompanyAnnouncementDetail;
