// Navigation links array
export const headers = [
  { label: "ABOUT US", path: "/about-us" },
  { label: "VERTICALS", path: "/products", dropdownKey: "verticals" },
  { label: "NEWS", path: "/news" },
  { label: "INVESTOR RELATIONS", path: "/investor-relations", dropdownKey: "investorRelations" },
  { label: "CONTACT", path: "/contact-us" },
  { label: "SHOP", path: "https://metaoptics.shop/" },
];

// Dropdown items configuration
export const dropdownItems = {
  verticals: {
    metalensEquipment: {
      label: "Metalens Equipment",
      path: "/metalens-equipment",
      hasIndicator: true,
      items: [
        { label: "Direct Laser Writer", path: "/product/direct-laser-writer" },
        { label: "Automatic Tester", path: "/product/metalens-automatic-tester" },
        { label: "Automatic Assembler & Tester", path: "/product/automated-metalens-camera-module-assembly-and-test-system" },
      ],
    },
    metalensFoundry: {
      label: "Metalens Foundry",
      path: "/metalens-foundry",
      hasIndicator: true,
      items: [
        { label: "4in & 12in Platforms", path: "/4in-12in-platforms" },
        { label: "Color Imaging Metalens", path: "/product/color-imaging-meta-lens" },
        { label: "IR Metalens", path: "/product/ultra-wide-fov-ir-metalens" },
        { label: "Ultra-Wide Lens", path: "/product/ultra-wide-fov-metalens-monochromatic-ir-camera" },
        { label: "CPOs", path: "/co-packaged-optics" },
      ],
    },
    metalensProducts: {
      label: "Metalens Products",
      path: "/metalens-products",
      hasIndicator: true,
      items: [
        { label: "Metalens 5G Smartphone", path: "/product/metalens-5g-smartphone" },
        { label: "Pico Projector", path: "/product/pico-projector" },
        { label: "Metalens AI Smart Glasses", path: "/product/metalens-ai-glasses" },
        { label: "Development Kits", path: "/development-kits" },
      ],
    },
    metaOpticsAi: {
      label: "MetaOptics AI",
      path: "/metaoptics-ai",
      isHighlighted: true,
    },
  },
  investorRelations: {
    companyAnnouncements: {
      label: "Company Announcements",
      path: "/investor-relations",
    },
    analystCoverage: {
      label: "Analyst Coverage",
      path: "/analyst-coverage",
    },
  },
};

// Legacy export for backward compatibility
export const productsDropdownItems = dropdownItems.verticals;
