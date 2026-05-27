'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const StockInfoPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/investor-relations/stock-info/stock-quote');
    }, [router]);

    return null;
};

export default StockInfoPage;
