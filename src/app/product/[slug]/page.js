import data from '@/constants/data.json';

import ProductDetailsClientSide from './ProductDetailsClientSide';

export const generateStaticParams = async () => {
    return data.products.map((product) => ({
        slug: product.slug,
    }));
};

const ProductDetailsPage = async props => {
    const params = await props.params;
    const product = data.products.find((item) => item.slug === params.slug);

    if (!product) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-4xl font-semibold text-red-500'>Product Not Found</h1>
            </div>
        );
    }

    return <ProductDetailsClientSide />;
};

export default ProductDetailsPage;
