'use client';

import { useParams } from 'next/navigation';

import data from '@/constants/news.json';

import Header from '@/layouts/main/header';
import NewsDetailsBanner from '@/layouts/news/details-banner';
import NewsDetailsContent from '@/layouts/news/details-content';
import NewsDetailsExtraImages from '@/layouts/news/details-extra-images';
import RelatedNews from '@/layouts/news/related-news';
import Footer from '@/layouts/main/footer';

const MOD = process.env.NEXT_PUBLIC_MOD || 'production';

const shouldIncludeNewsItem = (item) =>
    MOD === 'development' || !item.mod || item.mod === 'production';

const NewsDetailsClientSide = () => {
    const { slug } = useParams();

    const visibleNews = data.news.filter(shouldIncludeNewsItem);
    const news = visibleNews.find((item) => item.slug === slug);

    return (
        <>
            <Header />
            <div className={`mx-auto px-[5.2vw] xl:pb-[72px] pb-[48px]`}>
                <NewsDetailsBanner news={news} />
                <NewsDetailsContent news={news} />
                <NewsDetailsExtraImages news={news} />

                <RelatedNews relatedNews={news?.details?.relatedNews} />
            </div>

            <Footer />
        </>
    );
};

export default NewsDetailsClientSide;
