import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';

import ProductsClientSide from './ProductsClientSide';

export const metadata = buildPageMetadataFromSection('products');

const Products = () => {
    return <ProductsClientSide />;
};

export default Products;
