export const getProductPath = (slug) => {
  const equipmentSlugs = [
    'direct-laser-writer',
    'metalens-automatic-tester',
    'automated-metalens-camera-module-assembly-and-test-system'
  ];
  const foundrySlugs = [
    'color-imaging-meta-lens',
    'ultra-wide-fov-ir-metalens',
    'ultra-wide-fov-metalens-monochromatic-ir-camera'
  ];
  const productSlugs = [
    'metalens-5g-smartphone',
    'pico-projector',
    'metalens-ai-glasses'
  ];

  if (equipmentSlugs.includes(slug)) {
    return `/verticals/metalens-equipment/product/${slug}`;
  }
  if (foundrySlugs.includes(slug)) {
    return `/verticals/metalens-foundry/product/${slug}`;
  }
  if (productSlugs.includes(slug)) {
    return `/verticals/metalens-products/product/${slug}`;
  }
  
  // Default fallback if not found in specific categories
  return `/verticals/metalens-products/product/${slug}`;
};
