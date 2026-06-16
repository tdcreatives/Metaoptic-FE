import React from "react";

import Header from "@/layouts/main/header";
import EquipmentOverview from "@/layouts/equipment-overview";
import Footer from "@/layouts/main/footer";

const EquipmentOverviewClientSide = () => {
  return (
    <>
      <Header />
      <EquipmentOverview />
      <Footer />
    </>
  );
};

export default EquipmentOverviewClientSide;
