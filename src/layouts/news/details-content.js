'use client';

const NewsDetailsContent = ({ news = {} }) => {
    return (
        <div className='xl:pb-[72px] pb-[48px]'>
            <div
                dangerouslySetInnerHTML={{ __html: news.details.content }}
                className='xl:text-[20px] text-[16px]'
            />
            <br/>
            <div className='xl:text-[20px] text-[16px] flex flex-wrap gap-4'>
                <span className='font-bold'>Source:</span> <a href={news.path} target='_blank' rel='noopener noreferrer'>{news.path}</a>                
            </div>
        </div>
    );
};

export default NewsDetailsContent;
