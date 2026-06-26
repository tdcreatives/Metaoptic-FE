import data from '@/constants/data.json';
import { buildProductMetadata } from '@/lib/seo';
import ProductDetailsClientSide from '@/layouts/product-details/ProductDetailsClientSide';
import { productSlugs } from '@/utils/product';

export const generateStaticParams = async () => {
    return productSlugs.map((slug) => ({
        slug,
    }));
};

export const generateMetadata = async (props) => {
    const params = await props.params;
    const product = data.products.find((item) => item.slug === params.slug);
    return buildProductMetadata(
        product,
        `/verticals/metalens-products/${params.slug}`
    );
};

const ProductDetailsPage = async (props) => {
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
