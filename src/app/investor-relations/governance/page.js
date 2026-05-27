'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GovernancePage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-relations/governance/documents-and-charters');
    }, [router]);

    return null;
};

export default GovernancePage;
