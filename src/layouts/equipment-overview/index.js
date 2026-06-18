"use client";

import React from "react";

import BaseSplitBanner from "@/components/BaseSplitBanner";
import BaseFeatureSection from "@/components/BaseFeatureSection";
import BaseExploreSection from "@/components/BaseExploreSection";
import BaseProcessSection from "@/components/BaseProcessSection";
import BaseWhySection from "@/components/BaseWhySection";
import BaseCtaSection from "@/components/BaseCtaSection";

const EQUIPMENT_GLANCE = [
  {
    number: "01",
    icon: "/verticals/shared/ic-sec-1.svg",
    title: "Vertically Integrated",
    description: "Lithography, testing and assembly designed to work together.",
  },
  {
    number: "02",
    icon: "/verticals/shared/ic-sec-3.svg",
    title: "Prototype to Production",
    description: "Equipment for both R&D-scale and higher-volume runs.",
  },
  {
    number: "03",
    icon: "/verticals/shared/ic-sec-2.svg",
    title: "Single Supplier",
    description: "One partner across the full production chain.",
  },
  {
    number: "04",
    icon: "/verticals/shared/ic-sec-4.svg",
    title: "Backed by Metrology",
    description: "Tools paired with characterisation and test.",
  },
  {
    number: "05",
    icon: "/verticals/shared/ic-sec-5.svg",
    title: "Configurable",
    description: "Set up around your part, process and volume.",
  },
];

const EQUIPMENT_PROCESS = [
  {
    number: "01",
    title: "Pattern",
    description: "Write the metalens design onto the wafer.",
  },
  {
    number: "02",
    title: "Test",
    description: "Measure performance across the wafer.",
  },
  {
    number: "03",
    title: "Assemble",
    description: "Build and verify the camera module.",
  },
];

const EQUIPMENT_CATEGORIES = [
  {
    number: "01",
    icon: "/verticals/shared/icon-1.svg",
    title: "Lithography",
    description: "Direct-write metalens patterning at sub-100 nm resolution.",
    href: "/verticals/equipment/lithography",
  },
  {
    number: "02",
    icon: "/verticals/shared/icon-5.svg",
    title: "Testing",
    description: "Automated metrology from coupon to wafer scale.",
    href: "/verticals/equipment/testing",
  },
  {
    number: "03",
    icon: "/verticals/shared/icon-6.png",
    title: "Assembly",
    description: "Automated alignment, bonding and final test.",
    href: "/verticals/equipment/assembly",
  },
];

const EquipmentOverview = () => {
  return (
    <>
      <BaseSplitBanner
        title={
          <>
            MetaOptics
            <br />
            Equipment
          </>
        }
        subtitle="End-to-end metalens manufacturing equipment, from patterning to module integration."
        description="MetaOptics builds the capital equipment that turns metalens design into manufactured optics. Three vertically integrated capabilities, lithography, testing and assembly, cover the full production chain."
        videoSrc="/verticals/equipment/banner.mp4"
        posterSrc="/verticals/equipment/banner-poster.jpg"
        buttonLabel="Request a Demo"
        buttonHref="/contact-us"
      />

      <BaseFeatureSection
        title="Built for flat-optics manufacturing"
        description="Metalens production needs tools designed for nanoscale patterning, repeatable measurement and precise assembly. We build all three, so a line can move from a single coupon to volume on one supplier's equipment."
        imageSrc="/verticals/equipment/flat-optics.png"
        imageAlt="Built for flat-optics manufacturing"
        imagePosition="left"
      />

      <BaseExploreSection
        label="Our equipment"
        title="Categories"
        description="Each stage of flat-optics manufacturing has a dedicated platform. Together, they form a complete production line."
        items={EQUIPMENT_CATEGORIES}
        columns={3}
      />

      <BaseProcessSection
        label="Our process"
        title="From pattern to module"
        description="Each stage has its own platform, and the output of one feeds the next."
        imageSrc="/verticals/equipment/pattern-to-module.png"
        imageAlt="From pattern to module"
        steps={EQUIPMENT_PROCESS}
      />

      <BaseWhySection
        title="Equipment at a glance"
        items={EQUIPMENT_GLANCE}
        columns={5}
        iconAlign="center"
      />

      <BaseCtaSection
        label="Talk to our team"
        title="Talk to our equipment team"
        description="Looking to set up or expand a flat-optics line? Tell us what you need and we will scope it."
        imageSrc="/verticals/shared/find.png"
        imageAlt="Talk to our equipment team"
        buttonLabel="Contact us"
        buttonHref="/contact-us"
        backgroundImage="/verticals/shared/contact.png"
      />

      {/* Additional sections will be added here as the design is provided */}
    </>
  );
};

export default EquipmentOverview;
