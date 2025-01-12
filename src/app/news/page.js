import React from 'react';

import Header from '@/layouts/main/header';
import NewsList from '@/layouts/news/list';
import Footer from '@/layouts/main/footer';

const News = () => {
    return (
        <>
            <Header />
            <NewsList />
            <Footer />
        </>
    );
};

export default News;
