'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NewsPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-relations/news/press-releases');
    }, [router]);

    return null;
};

export default NewsPage;
