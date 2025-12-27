"use client";

import { useState, useEffect } from "react";

const useMobile = () => {
  const [isMobileState, setIsMobileState] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobileState;
};

export default useMobile;

