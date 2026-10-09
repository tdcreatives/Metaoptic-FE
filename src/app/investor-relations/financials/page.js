'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FinancialsPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-relations/financials/sec-filings');
    }, [router]);

    return null;
};

export default FinancialsPage;
