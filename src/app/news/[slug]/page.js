import data from '@/constants/news.json';

import NewsDetailsClientSide from './NewsDetailsClientSide';

const MOD = process.env.NEXT_PUBLIC_MOD || 'production';

const shouldIncludeNewsItem = (item) =>
    MOD === 'development' || !item.mod || item.mod === 'production';

const visibleNews = data.news.filter(shouldIncludeNewsItem);

export const generateStaticParams = async () => {
    return visibleNews.map((item) => ({
        slug: item.slug,
    }));
};

export const generateMetadata = async (props) => {
    const params = await props.params;
    const news = visibleNews.find((item) => item.slug === params.slug);
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

    const news = visibleNews.find((item) => item.slug === params.slug);
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
