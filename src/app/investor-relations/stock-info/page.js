'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultStockInfoPath } from '@/constants/ir-feature-flags';

const StockInfoPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace(getDefaultStockInfoPath());
    }, [router]);

    return null;
};

export default StockInfoPage;
