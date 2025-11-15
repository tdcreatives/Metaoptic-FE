import React from 'react';

import metadataJson from '@/constants/metadata.json';
import items from '@/constants/announcements.json';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import AnnouncementDetailContent from '@/layouts/investor-relations/announcement-detail-content';
import AnnouncementBanner from '@/layouts/investor-relations/announcement-banner';

export const metadata = {
    title: metadataJson.investorrelations.title,
    description: metadataJson.investorrelations.description,
    keywords: metadataJson.investorrelations.keywords,
    openGraph: {
        images: [metadataJson.investorrelations.ogImage],
        url: metadataJson.investorrelations.ogUrl,
        type: metadataJson.investorrelations.ogType,
        siteName: metadataJson.investorrelations.ogSiteName,
        locale: metadataJson.investorrelations.ogLocale,
    },
    twitter: {
        card: metadataJson.investorrelations.twitterCard,
        creator: metadataJson.investorrelations.twitterCreator,
        site: metadataJson.investorrelations.twitterSite,
        title: metadataJson.investorrelations.twitterTitle,
        description: metadataJson.investorrelations.twitterDescription,
    },
};

export async function generateStaticParams() {
    return items.map((item) => ({
        slug: item.slug,
    }));
}

const Announcement = async (props) => {
    const params = await props.params;

    const announcement = items.find((item) => item.slug === params.slug);
    return (
        <>
            <Header />
            <AnnouncementBanner bannerTitle={announcement?.title_banner} />
            <AnnouncementDetailContent />
            <Footer />
        </>
    );
};

export default Announcement;
