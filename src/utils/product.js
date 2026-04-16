export const equipmentSlugs = [
  'direct-laser-writer',
  'metalens-automatic-tester',
  'automated-metalens-camera-module-assembly-and-test-system'
];
export const foundrySlugs = [
  'color-imaging-meta-lens',
  'ultra-wide-fov-ir-metalens',
  'ultra-wide-fov-metalens-monochromatic-ir-camera',
  'metalens-color-camera-module',
];

export const developmentKitsSlugs = [
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
