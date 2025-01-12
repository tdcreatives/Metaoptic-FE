'use client';

import { useParams } from 'next/navigation';

import data from '@/constants/news.json';

import Header from '@/layouts/main/header';
import NewsDetailsBanner from '@/layouts/news/details-banner';
import NewsDetailsContent from '@/layouts/news/details-content';
import NewsDetailsExtraImages from '@/layouts/news/details-extra-images';
import Footer from '@/layouts/main/footer';

const NewsDetailsClientSide = () => {
    const { slug } = useParams();

    const news = data.news.find((item) => item.slug === slug);

    return (
        <>
            <Header />
            <div className='mx-auto px-[5.2vw]'>
                <NewsDetailsBanner news={news} />
                <NewsDetailsContent news={news} />

                <NewsDetailsExtraImages news={news} />
            </div>

            <Footer />
        </>
    );
};

export default NewsDetailsClientSide;
