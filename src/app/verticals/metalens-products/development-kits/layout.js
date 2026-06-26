import { buildPageMetadataFromSection } from '@/lib/seo';

export const metadata = buildPageMetadataFromSection('developmentKits');

export default function DevelopmentKitsLayout({ children }) {
    return children;
}
