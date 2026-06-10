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
    metalensEquipment: {
      label: "Metalens Capital Equipment",
      path: "/verticals/metalens-capital-equipment",
      hasIndicator: true,
      items: [
        { label: "Direct Laser Writer", path: "/verticals/metalens-capital-equipment/direct-laser-writer" },
        { label: "Manual Tester", path: "/verticals/metalens-capital-equipment/manual-tester" },
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
        // { label: "Color Imaging Metalens", path: "/verticals/metalens-foundry/color-imaging-meta-lens" },
        { label: "Round RGB Metalens", path: "/verticals/metalens-foundry/round-rgb-metalens" },
        { label: "Rectangular RGB Metalens", path: "/verticals/metalens-foundry/rectangular-rgb-metalens" },
        { label: "Ultra-wide FOV IR Metalens", path: "/verticals/metalens-foundry/ultra-wide-fov-ir-metalens" },
        // { label: "Ultra-Wide fov Metalens", path: "/verticals/metalens-foundry/ultra-wide-fov-metalens-monochromatic-ir-camera" },
        { label: "CPO", path: "/verticals/metalens-foundry/co-packaged-optics" },
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
