'use client';

import { useState, useEffect } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import matter from 'gray-matter';
import '@/styles/mdx.css';

const NewsDetailsContent = ({ news = {} }) => {
    const [mdxSource, setMdxSource] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            if (news?.details?.contentPath) {
                try {
                    setLoading(true);
                    setError(null);
                    console.log('Fetching content from:', news.details.contentPath);
                    const response = await fetch(news.details.contentPath);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const content = await response.text();
                    console.log('Content loaded:', content.substring(0, 100) + '...');
                    
                    // Parse the content with gray-matter to separate metadata
                    const { content: mdxContent } = matter(content);
                    
                    const mdxSource = await serialize(mdxContent);
                    setMdxSource(mdxSource);
                } catch (error) {
                    console.error('Error loading MDX content:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadContent();
    }, [news]);

    if (loading) {
        return (
            <div className='xl:pb-[72px] pb-[48px]'>
                <div className='xl:text-[20px] text-[16px]'>Loading content...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='xl:pb-[72px] pb-[48px]'>
                <div className='xl:text-[20px] text-[16px] text-red-500'>
                    Error loading content: {error}
                </div>
            </div>
        );
    }

    if (!mdxSource) {
        return (
            <div className='xl:pb-[72px] pb-[48px]'>
                <div className='xl:text-[20px] text-[16px]'>No content available</div>
            </div>
        );
    }

    return (
        <div className='xl:pb-[72px] pb-[48px]'>
            <div className='xl:text-[20px] text-[16px]'>
                <MDXRemote {...mdxSource} />
            </div>
            <br/>
            <div className='xl:text-[20px] text-[16px] flex flex-wrap gap-4'>
                <span className='font-bold'>Source:</span>
                <a href={news.path} target='_blank' rel='noopener noreferrer' className='mdx-link'>
                    {news.path}
                </a>
            </div>
        </div>
    );
};

export default NewsDetailsContent;
