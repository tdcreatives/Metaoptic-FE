// Navigation links array
export const headers = [
  { label: "ABOUT US", path: "/about-us" },
  { label: "VERTICALS", path: "/verticals", dropdownKey: "verticals" },
  { label: "NEWS", path: "/news" },
  { label: "INVESTOR RELATIONS", path: "/investor-relations", dropdownKey: "investorRelations" },
  { label: "CONTACT", path: "/contact-us" },
  { label: "SHOP", path: "https://metaoptics.shop/" },
];

// Dropdown items configuration
export const dropdownItems = {
  verticals: {
    metalensEquipment: {
      label: "Metalens Capital Equipment",
      path: "/verticals/metalens-capital-equipment",
      hasIndicator: true,
      items: [
        { label: "Direct Laser Writer", path: "/verticals/metalens-capital-equipment/direct-laser-writer" },
        { label: "Automatic Tester", path: "/verticals/metalens-capital-equipment/metalens-automatic-tester" },
        { label: "Automatic Assembler & Tester", path: "/verticals/metalens-capital-equipment/automated-metalens-camera-module-assembly-and-test-system" },
      ],
    },
    metalensFoundry: {
      label: "Metalens Foundry",
      path: "/verticals/metalens-foundry",
      hasIndicator: true,
      items: [
        { label: "4\" & 12\" Platforms", path: "/verticals/metalens-foundry/4in-12in-platforms" },
        { label: "Color Imaging Metalens", path: "/verticals/metalens-foundry/color-imaging-meta-lens" },
        { label: "Round RGB Metalens", path: "/verticals/metalens-foundry/round-rgb-metalens" },
        { label: "Rectangular RGB Metalens", path: "/verticals/metalens-foundry/rectangular-rgb-metalens" },
        { label: "IR Metalens", path: "/verticals/metalens-foundry/ultra-wide-fov-ir-metalens" },
        { label: "Ultra-Wide fov Metalens", path: "/verticals/metalens-foundry/ultra-wide-fov-metalens-monochromatic-ir-camera" },
        { label: "CPOs", path: "/verticals/metalens-foundry/co-packaged-optics" },
      ],
    },  
    metalensProducts: {
      label: "Metalens Products",
      path: "/verticals/metalens-products",
      hasIndicator: true,
      items: [
        { label: "Metalens 5G Smartphone", path: "/verticals/metalens-products/metalens-5g-smartphone" },
        { label: "Pico Projector (2nd generation)", path: "/verticals/metalens-products/pico-projector-2nd-generation" },
        { label: "Metalens AI Smart Glasses", path: "/verticals/metalens-products/metalens-ai-glasses" },
        { label: "Development Kits", path: "/verticals/metalens-products/development-kits" },
      ],
    },
    metaOpticsAi: {
      label: "MetaOptics AI",
      path: "/verticals/metaoptics-ai",
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
