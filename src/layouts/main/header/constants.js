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
        { label: "Overview", path: "/verticals/metalens-capital-equipment" },
        { label: "Lithography", path: "#" },
        { label: "Testing", path: "#" },
        { label: "Assembly", path: "#" },
      ],
    },
    metaOpticsFoundry: {
      label: "MetaOptics Foundry",
      icon: "/common/foundary.svg",
      path: "/verticals/metalens-foundry",
      items: [
        { label: "Overview", path: "/verticals/metalens-foundry" },
        { label: "VIS Metalens", path: "#" },
        { label: "NIR & SWIR Metalenses", path: "#" },
        { label: "Photonic Integrations", path: "#" },
      ],
    },
    metaOpticsProducts: {
      label: "MetaOptics Products",
      icon: "/common/products.svg",
      path: "/verticals/metalens-products",
      items: [
        { label: "Overview", path: "/verticals/metalens-products" },
        { label: "Consumer Devices", path: "#" },
        { label: "Projection Modules", path: "#" },
        { label: "Development Kits", path: "#" },
      ],
    },
    metaOpticsAi: {
      label: "MetaOptics AI",
      icon: "/common/ai.svg",
      path: "/verticals/metaoptics-ai",
      items: [
        { label: "Overview", path: "/verticals/metaoptics-ai" },
        { label: "MOTViewer", path: "#" },
        { label: "AI Models & Algorithms", path: "#" },
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
