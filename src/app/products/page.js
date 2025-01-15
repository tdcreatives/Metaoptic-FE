import React from 'react';

import metadataJson from '@/constants/metadata.json';

import ProductsClientSide from './ProductsClientSide';

export const metadata = {
    title: metadataJson.products.title,
    description: metadataJson.products.description,
};

const Products = () => {
    return <ProductsClientSide />;
};

export default Products;
