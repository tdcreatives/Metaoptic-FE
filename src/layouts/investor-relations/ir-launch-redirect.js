'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const IrLaunchRedirect = ({ to }) => {
    const router = useRouter();

    useEffect(() => {
        router.replace(to);
    }, [router, to]);

    return null;
};

export default IrLaunchRedirect;
