// Navigation links array
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';

export const headers = [
  { label: "ABOUT US", path: "/about-us" },
  { label: "VERTICALS", path: "/verticals", dropdownKey: "verticals" },
  { label: "NEWS", path: "/news" },
  { label: "INVESTOR RELATIONS", path: "/investor-relations", dropdownKey: "investorRelations" },
  { label: "CONTACT", path: "/contact-us" },
  { label: "SHOP", path: "https://metaoptics.shop/" },
];

// Dropdown items configuration
const dropdownItemsBase = {
  verticals: {
    metaOpticsEquipment: {
      label: "MetaOptics Equipment",
      icon: "/common/equipment.svg",
      path: "/verticals/metalens-capital-equipment",
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
      path: "/verticals/metalens-foundry",
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
      path: "/verticals/metalens-products",
      items: [
        { label: "Overview", path: "/verticals/product/overview" },
        { label: "Consumer Devices", path: "/verticals/product/consumer-devices" },
        { label: "Projection Modules", path: "/verticals/product/projection-modules" },
        { label: "Development Kits", path: "/verticals/product/development-kits" },
      ],
    },
    metaOpticsAi: {
      label: "MetaOptics AI",
      icon: "/common/ai.svg",
      path: "/verticals/metaoptics-ai",
      items: [
        { label: "Overview", path: "/verticals/ai/overview" },
        { label: "MOTViewer", path: "/verticals/ai/motviewer" },
        { label: "AI Models & Algorithms", path: "/verticals/ai/ai-models" },
      ],
    },
  },
  investorRelations: {
    singaporeExchange: {
      label: "SGX",
      path: "#",
      hasIndicator: true,
      items: [
        { label: "Company Announcements", path: "/company-announcement" },
        { label: "Analyst Coverage", path: "/analyst-coverage" },
      ],
    },
    nasdaq: {
      label: "NASDAQ",
      path: "/investor-relations",
    },
  },
};

export const dropdownItems = dropdownItemsBase;

export const getDropdownItems = () => {
  if (IR_LAUNCH_FLAGS.showAnalystCoverage) {
    return dropdownItemsBase;
  }

  return {
    ...dropdownItemsBase,
    investorRelations: {
      ...dropdownItemsBase.investorRelations,
      singaporeExchange: {
        ...dropdownItemsBase.investorRelations.singaporeExchange,
        items: dropdownItemsBase.investorRelations.singaporeExchange.items.filter(
          (item) => item.path !== '/analyst-coverage'
        ),
      },
    },
  };
};

// Legacy export for backward compatibility
export const productsDropdownItems = dropdownItemsBase.verticals;
