import React from 'react';

import Header from '@/layouts/main/header';
import NewsList from '@/layouts/news/list';
import Footer from '@/layouts/main/footer';

const NewsClientSide = () => {
    return (
        <>
            <Header />
            <NewsList />
            <Footer />
        </>
    );
};

export default NewsClientSide;
