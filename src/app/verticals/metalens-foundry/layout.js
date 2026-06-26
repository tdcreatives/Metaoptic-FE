import { buildPageMetadataFromSection } from '@/lib/seo';

export const metadata = buildPageMetadataFromSection('metalensFoundry');

export default function MetalensFoundryLayout({ children }) {
    return children;
}
