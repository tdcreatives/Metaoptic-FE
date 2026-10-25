'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResourcesPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-relations/resources/investor-faqs');
    }, [router]);

    return null;
};

export default ResourcesPage;
