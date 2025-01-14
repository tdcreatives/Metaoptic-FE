'use client';

const NewsDetailsContent = ({ news = {} }) => {
    return (
        <div className='xl:pb-[72px] pb-[48px]'>
            <div
                dangerouslySetInnerHTML={{ __html: news.details.content }}
                className='xl:text-[20px] text-[16px]'
            />
        </div>
    );
};

export default NewsDetailsContent;
