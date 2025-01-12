'use client';

const NewsDetailsContent = ({ news = {} }) => {
    return (
        <div className='pb-[72px]'>
            <div
                dangerouslySetInnerHTML={{ __html: news.details.content }}
                className='xl:text-[28px] text-[18px]'
            />
        </div>
    );
};

export default NewsDetailsContent;
