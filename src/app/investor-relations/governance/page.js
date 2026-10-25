'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDefaultGovernancePath } from '@/constants/ir-feature-flags';

const GovernancePage = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace(getDefaultGovernancePath());
    }, [router]);

    return null;
};

export default GovernancePage;
