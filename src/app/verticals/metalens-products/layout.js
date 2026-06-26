import { buildPageMetadataFromSection } from '@/lib/seo';

export const metadata = buildPageMetadataFromSection('metalensProducts');

export default function MetalensProductsLayout({ children }) {
    return children;
}
