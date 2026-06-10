import { redirect } from 'next/navigation';

import items from '@/constants/announcements.json';

export async function generateStaticParams() {
    return items.map((item) => ({
        slug: item.slug,
    }));
}

export default async function LegacyAnnouncementDetail(props) {
    const params = await props.params;
    redirect(`/company-announcement/${params.slug}`);
}
