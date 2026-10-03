// Navigation links array
export const headers = [
  { label: "ABOUT US", path: "/about-us" },
  { label: "VERTICALS", path: "/verticals", dropdownKey: "verticals" },
  { label: "NEWS", path: "/news" },
  { label: "INVESTOR RELATIONS", path: "/investor-relations" },
  { label: "CONTACT", path: "/contact-us" },
  { label: "SHOP", path: "https://metaoptics.shop/" },
];

// Dropdown items configuration
const dropdownItemsBase = {
  verticals: {
    metaOpticsEquipment: {
      label: "MetaOptics Equipment",
      icon: "/common/equipment.svg",
      path: "/verticals/equipment/overview",
      items: [
        { label: "Overview", path: "/verticals/equipment/overview" },
        { label: "Lithography", path: "/verticals/equipment/lithography" },
        { label: "Testing", path: "/verticals/equipment/testing" },
        { label: "Assembly", path: "/verticals/equipment/assembly" },
      ],
    },
    metaOpticsFoundry: {
      label: "MetaOptics Foundry",
      icon: "/common/foundary.svg",
      path: "/verticals/foundary/overview",
      items: [
        { label: "Overview", path: "/verticals/foundary/overview" },
        { label: "VIS Metalens", path: "/verticals/foundary/vis-metalens" },
        { label: "NIR & SWIR Metalenses", path: "/verticals/foundary/nir-swir-metalens" },
        { label: "Photonic Integrations", path: "/verticals/foundary/photonics-integration" },
      ],
    },
    metaOpticsProducts: {
      label: "MetaOptics Products",
      icon: "/common/products.svg",
      path: "/verticals/product/overview",
      items: [
        { label: "Overview", path: "/verticals/product/overview" },
        { label: "Consumer Devices", path: "/verticals/product/consumer-devices" },
        { label: "Projection Modules", path: "/verticals/product/projection-modules" },
        { label: "Camera Modules", path: "/verticals/product/camera-modules" },
        { label: "Development Kits", path: "/verticals/product/development-kits" },
      ],
    },
    metaOpticsAi: {
      label: "MetaOptics AI",
      icon: "/common/ai.svg",
      path: "/verticals/ai/overview",
      items: [
        { label: "Overview", path: "/verticals/ai/overview" },
        { label: "MOTViewer", path: "/verticals/ai/motviewer" },
        { label: "AI Models & Algorithms", path: "/verticals/ai/ai-models" },
      ],
    },
  },
};

export const dropdownItems = dropdownItemsBase;

export const getDropdownItems = () => dropdownItemsBase;

// Legacy export for backward compatibility
export const productsDropdownItems = dropdownItemsBase.verticals;
