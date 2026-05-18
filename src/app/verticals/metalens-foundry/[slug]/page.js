import data from '@/constants/data.json';
import ProductDetailsClientSide from '@/layouts/product-details/ProductDetailsClientSide';
import { foundrySlugs } from '@/utils/product';
import { redirect } from 'next/navigation';

const LEGACY_IOT_CAMERA_SLUG = 'iot-metalens-color-camera';
const RECTANGULAR_IOT_CAMERA_SLUG = 'iot-rectangular-metalens-color-camera';

export const generateStaticParams = async () => {
    return [...foundrySlugs, LEGACY_IOT_CAMERA_SLUG].map((slug) => ({
        slug,
    }));
};

export const generateMetadata = async (props) => {
    const params = await props.params;
    const slug = params.slug === LEGACY_IOT_CAMERA_SLUG ? RECTANGULAR_IOT_CAMERA_SLUG : params.slug;
    const product = data.products.find((item) => item.slug === slug);
    return {
        title: product?.name,
        description: product?.details?.description,
    };
};

const ProductDetailsPage = async (props) => {
    const params = await props.params;
    if (params.slug === LEGACY_IOT_CAMERA_SLUG) {
        redirect(
            `/verticals/metalens-products/development-kits/${RECTANGULAR_IOT_CAMERA_SLUG}`
        );
    }

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
