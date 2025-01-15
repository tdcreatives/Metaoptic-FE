import React from 'react';

import Header from '@/layouts/main/header';
import ProductList from '@/layouts/products/list';
import Footer from '@/layouts/main/footer';

const ProductsClientSide = () => {
    return (
        <>
            <Header />
            <ProductList />
            <Footer />
        </>
    );
};

export default ProductsClientSide;
