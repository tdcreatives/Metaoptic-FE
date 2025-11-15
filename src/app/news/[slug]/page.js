import data from '@/constants/news.json';

import NewsDetailsClientSide from './NewsDetailsClientSide';

export const generateStaticParams = async () => {
    return data.news.map((item) => ({
        slug: item.slug,
    }));
};

export const generateMetadata = async (props) => {
    const params = await props.params;
    const news = data.news.find((item) => item.slug === params.slug);
    return {
        title: news?.title,
        description: news?.desc,
        openGraph: {
            images: ['https://metaoptics.sg' + news?.image],
        },
    };
};

const NewsDetailsPage = async (props) => {
    const params = await props.params;

    const news = data.news.find((item) => item.slug === params.slug);
    if (!news) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-4xl font-semibold text-red-500'>News Not Found</h1>
            </div>
        );
    }

    return <NewsDetailsClientSide />;
};

export default NewsDetailsPage;
