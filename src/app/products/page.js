import React from 'react';

import metadataJson from '@/constants/metadata.json';

import ProductsClientSide from './ProductsClientSide';

export const metadata = {
    title: metadataJson.products.title,
    description: metadataJson.products.description,
    keywords: metadataJson.products.keywords,
    ogImage: metadataJson.products.ogImage,
    ogUrl: metadataJson.products.ogUrl,
    ogType: metadataJson.products.ogType,
    ogSiteName: metadataJson.products.ogSiteName,
    ogLocale: metadataJson.products.ogLocale,
    twitterCard: metadataJson.products.twitterCard,
    twitterCreator: metadataJson.products.twitterCreator,
    twitterSite: metadataJson.products.twitterSite,
    twitterTitle: metadataJson.products.twitterTitle,
    twitterDescription: metadataJson.products.twitterDescription,
};

const Products = () => {
    return <ProductsClientSide />;
};

export default Products;
