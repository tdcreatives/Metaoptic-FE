// Navigation links array
export const headers = [
  { label: "ABOUT US", path: "/about-us" },
  { label: "PRODUCTS", path: "/products", dropdownKey: "products" },
  { label: "NEWS", path: "/news" },
  { label: "INVESTOR RELATIONS", path: "/investor-relations", dropdownKey: "investorRelations" },
  { label: "CONTACT", path: "/contact-us" },
  { label: "SHOP", path: "https://metaoptics.shop/" },
];

// Dropdown items configuration
export const dropdownItems = {
  products: {
    consumerProducts: {
      label: "Latest Products",
      items: [
        {
          label: "Metalens 5G Smartphone",
          path: "/product/metalens-5g-smartphone",
        },
        { label: "Metalens AI Glasses", path: "/product/metalens-ai-glasses" },
        {
          label: "Pico Projector (2nd generation)",
          path: "/product/pico-projector-2nd-generation",
        },
      ],
    },
    cameraLensSystems: {
      label: "Lens & Equipment",
      path: "/products",
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
export const productsDropdownItems = dropdownItems.products;
