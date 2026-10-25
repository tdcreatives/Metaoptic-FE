export const equipmentSlugs = [
  'direct-laser-writer',
  'metalens-automatic-tester',
  'automated-metalens-camera-module-assembly-and-test-system',
  'manual-tester',
  'wafer-level-metalens-tester'
];
export const foundrySlugs = [
  // 'color-imaging-meta-lens',
  'round-rgb-metalens',
  'rectangular-rgb-metalens',
  'ultra-wide-fov-ir-metalens',
  'ultra-wide-fov-metalens-monochromatic-ir-camera',
  '2mp-rectangular-rgb-metalens-fc-module',
  '5mp-rectangular-rgb-metalens-fc-module',
];

export const developmentKitsSlugs = [
  'iot-metalens-color-camera',
  'iot-rectangular-metalens-color-camera',
  '3d-biometrics-metalens-sensor',
];
export const productSlugs = [
  'metalens-5g-smartphone',
  'pico-projector',
  'metalens-ai-glasses',
  'collimating-meta-lens-pico-projector',
  'pico-projector-2nd-generation',
];

export const staticPages = [
    '4in-12in-platforms',
    'co-packaged-optics',
    'development-kits'
];

// ponytail: filename for <a download>; ceiling = naive sanitize, upgrade if need unicode slugify
export const toBrochureFileName = (productName) => {
  const base = String(productName || "brochure")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[\\/:*?"<>|]/g, "");
  return `${base}.pdf`;
};

// CDN serves files at host root (and /software/…), not under /download/
export const DOWNLOAD_HOST = "https://download.metaoptics.sg";

// /download/foo.pdf → https://download.metaoptics.sg/foo.pdf
// https://www.metaoptics.sg/download/foo.pdf → same
export const toDownloadUrl = (path) => {
  if (!path || typeof path !== "string") return path;
  const trimmed = path.trim();
  if (/^https?:\/\/download\.metaoptics\.sg\//i.test(trimmed)) return trimmed;
  const fromApex = trimmed.replace(
    /^https?:\/\/(www\.)?metaoptics\.sg\/+download\//i,
    `${DOWNLOAD_HOST}/`
  );
  if (fromApex !== trimmed) return fromApex;
  if (trimmed.startsWith("/download/")) {
    return DOWNLOAD_HOST + trimmed.slice("/download".length);
  }
  return trimmed;
};

// Normalize brochure / userGuide / installer (+ nested keyFeatures) once for product detail
export const withDownloadUrls = (product) => {
  if (!product) return product;
  const next = { ...product };
  if (next.brochure) next.brochure = toDownloadUrl(next.brochure);
  if (next.userGuide?.link) {
    next.userGuide = {
      ...next.userGuide,
      link: toDownloadUrl(next.userGuide.link),
    };
  }
  if (next.installer) {
    const installer = { ...next.installer };
    if (Array.isArray(installer.link)) {
      installer.link = installer.link.map((item) =>
        item?.link ? { ...item, link: toDownloadUrl(item.link) } : item
      );
    } else if (installer.link) {
      installer.link = toDownloadUrl(installer.link);
    }
    next.installer = installer;
  }
  const left = next.details?.keyFeatures?.leftSection;
  if (left) {
    const leftNext = { ...left };
    if (leftNext.brochure) leftNext.brochure = toDownloadUrl(leftNext.brochure);
    if (leftNext.userGuide?.link) {
      leftNext.userGuide = {
        ...leftNext.userGuide,
        link: toDownloadUrl(leftNext.userGuide.link),
      };
    }
    next.details = {
      ...next.details,
      keyFeatures: {
        ...next.details.keyFeatures,
        leftSection: leftNext,
      },
    };
  }
  return next;
};

export const getProductPath = (slug) => {
  if (equipmentSlugs.includes(slug)) {
    return `/verticals/metalens-capital-equipment/${slug}`;
  }
  if (developmentKitsSlugs.includes(slug)) {
    return `/verticals/metalens-products/development-kits/${slug}`;
  }
  if (foundrySlugs.includes(slug)) {
    return `/verticals/metalens-foundry/${slug}`;
  }
  if (productSlugs.includes(slug)) {
    return `/verticals/metalens-products/${slug}`;
  }

  // Handle static pages
  if (slug === '4in-12in-platforms' || slug === 'co-packaged-optics') {
      return `/verticals/metalens-foundry/${slug}`;
  }
  if (slug === 'development-kits') {
      return `/verticals/metalens-products/${slug}`;
  }
  
  // Default fallback if not found in specific categories
  return `/verticals/metalens-products/${slug}`;
};
