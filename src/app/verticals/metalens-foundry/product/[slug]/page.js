import data from '@/constants/data.json';
import ProductDetailsClientSide from '@/layouts/product-details/ProductDetailsClientSide';

const CATEGORY_SLUGS = [
  'color-imaging-meta-lens',
  'ultra-wide-fov-ir-metalens',
  'ultra-wide-fov-metalens-monochromatic-ir-camera'
];

export const generateStaticParams = async () => {
    return CATEGORY_SLUGS.map((slug) => ({
        slug,
    }));
};

export const generateMetadata = async (props) => {
    const params = await props.params;
    const product = data.products.find((item) => item.slug === params.slug);
    return {
        title: product?.name,
        description: product?.details?.description,
    };
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
