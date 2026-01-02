"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { gsap } from "gsap";
import { isMobile } from "react-device-detect";
import BaseHamburger from "@/components/BaseHamburger";
import BaseMobileHamburger from "@/components/BaseHamburger/MobileHamburger";

const Header = ({ background = "#fff" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isConsumerProductsHovered, setIsConsumerProductsHovered] =
    useState(false);
  const [isMobileProductsDropdownOpen, setIsMobileProductsDropdownOpen] =
    useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const menuItemRef = useRef(null);
  const productsDropdownRef = useRef(null);

  // Navigation links array
  const headers = [
    { label: "ABOUT US", path: "/about-us" },
    { label: "PRODUCTS", path: "/products", hasDropdown: true },
    { label: "NEWS", path: "/news" },
    { label: "INVESTOR RELATIONS", path: "/investor-relations" },
    { label: "CONTACT", path: "/contact-us" },
    { label: "SHOP", path: "https://metaoptics.shop/" },
  ];

  // Products dropdown structure
  const productsDropdownItems = {
    consumerProducts: {
      label: "Consumer Products",
      items: [
        { label: "Smartphone", path: "/product/metalens-5g-smartphone" },
        { label: "Smart Glasses", path: "/product/metalens-ai-glasses" },
        {
          label: "Pico Projector 2.0",
          path: "/product/pico-projector-2nd-generation",
        },
      ],
    },
    cameraLensSystems: {
      label: "Camera, Lens & Systems",
      path: "/products",
    },
  };

  const handleMenuShow = () => {
    // Change to close icon and animate menu in
    setIsHoveringMenu(true);
    gsap.set(menuItemRef.current, { x: "100%", autoAlpha: 0 });
    gsap.to(menuItemRef.current, {
      x: "0%",
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  };
  const handleMenuHidden = () => {
    // Animate menu out and revert icon
    gsap.to(menuItemRef.current, {
      x: "100%",
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setIsHoveringMenu(false); // Switch back to hamburger icon
      },
    });
  };
  const handleMobileMenuToggle = () => {
    if (isMenuOpen) {
      gsap.to(menuRef.current, {
        x: "100%",
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => setIsMenuOpen(false),
      });
    } else {
      gsap.set(menuRef.current, { x: "100%", autoAlpha: 0 });
      gsap.to(menuRef.current, {
        x: "0%",
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
        onStart: () => setIsMenuOpen(true),
      });
    }
  };

  useEffect(() => {
    gsap.set(menuItemRef.current, {
      x: "100%",
      autoAlpha: 0,
    });
  }, []);

  useEffect(() => {
    gsap.set(menuRef.current, { x: "100%", autoAlpha: 0 });
  }, []);

  const handleNavigation = (path) => {
    if (path.startsWith("/")) {
      router.push(path);
    } else {
      window.location.href = path;
    }
    setIsProductsDropdownOpen(false);
    setIsConsumerProductsHovered(false);
    setIsMobileProductsDropdownOpen(false);
  };

  const handleProductsMouseEnter = () => {
    setIsProductsDropdownOpen(true);
  };

  const handleProductsMouseLeave = () => {
    setIsProductsDropdownOpen(false);
    setIsConsumerProductsHovered(false);
  };

  return (
    <div
      className="relative z-50 font-bold flex justify-between items-center mx-auto xl:px-[72px] xl:py-[44px] px-[24px] py-[20px]"
      style={{
        background,
      }}
    >
      {/* Logo */}
      <Image
        src="/logo.svg"
        alt="Logo"
        width="0"
        height="0"
        className="xl:w-[20vw] w-[200px] h-auto cursor-pointer"
        priority
        onClick={() => router.push("/")}
      />

      {!isMobile && (
        <div className="flex justify-between items-center space-x-4">
          {/* Navigation Bar */}
          <nav
            className="hidden xl:flex space-x-8 text-[16px] uppercase overflow-visible"
            ref={menuItemRef}
          >
            {headers.map((header) => {
              if (header.hasDropdown) {
                return (
                  <div
                    key={header.label}
                    className="relative"
                    onMouseEnter={handleProductsMouseEnter}
                    onMouseLeave={handleProductsMouseLeave}
                    ref={productsDropdownRef}
                  >
                    <a
                      className={`relative text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                        pathName === header.path ||
                        pathName.startsWith("/product")
                          ? "after:!w-2 !text-[#d44c39]"
                          : ""
                      }`}
                    >
                      {header.label}
                    </a>

                    {/* Products Dropdown Menu */}
                    {isProductsDropdownOpen && (
                      <div className="absolute top-full left-0 pt-2 z-[100] pointer-events-auto">
                        <div className="bg-white shadow-lg border border-gray-200 py-2 min-w-[240px]">
                          {/* Consumer Products with sub-menu */}
                          <div className="relative">
                            <div
                              className="px-4 py-2 text-black hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                              onMouseEnter={() =>
                                setIsConsumerProductsHovered(true)
                              }
                            >
                              <span>
                                {productsDropdownItems.consumerProducts.label}
                              </span>
                              <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>

                            {/* Consumer Products Sub-menu */}
                            {isConsumerProductsHovered && (
                              <div
                                className="absolute left-full top-0 pl-2 z-[110]"
                                onMouseEnter={() =>
                                  setIsConsumerProductsHovered(true)
                                }
                                onMouseLeave={() =>
                                  setIsConsumerProductsHovered(false)
                                }
                              >
                                <div className="bg-white shadow-lg border border-gray-200 min-w-[220px] py-2">
                                  {productsDropdownItems.consumerProducts.items.map(
                                    (item) => (
                                      <a
                                        key={item.path}
                                        className="block px-4 py-2 text-black hover:bg-gray-50 hover:text-[#d44c39] cursor-pointer"
                                        onClick={() =>
                                          handleNavigation(item.path)
                                        }
                                      >
                                        {item.label}
                                      </a>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Camera, Lens & Systems */}
                          <a
                            className="block px-4 py-2 text-black hover:bg-gray-50 hover:text-[#d44c39] cursor-pointer"
                            onClick={() =>
                              handleNavigation(
                                productsDropdownItems.cameraLensSystems.path
                              )
                            }
                          >
                            {productsDropdownItems.cameraLensSystems.label}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={header.label}
                  className={`relative text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                    pathName === header.path ? "after:!w-2 !text-[#d44c39]" : ""
                  }`}
                  onClick={() => handleNavigation(header.path)}
                >
                  {header.label}
                </a>
              );
            })}
          </nav>
          <BaseHamburger onShow={handleMenuShow} onHide={handleMenuHidden} />
        </div>
      )}

      {isMobile && (
        <>
          {/* Hamburger Button */}
          <div className="cursor-pointer relative">
            <BaseMobileHamburger onClick={handleMobileMenuToggle} />
          </div>

          {/* Mobile Navigation Menu */}
          <nav
            className="fixed top-0 right-0 h-full w-full bg-white flex flex-col items-center justify-center space-y-8 text-[20px] uppercase z-50"
            ref={menuRef}
          >
            <div className="absolute top-[24px] right-[24px] cursor-pointer">
              <BaseMobileHamburger
                className="open"
                onClick={handleMobileMenuToggle}
              />
            </div>
            {headers.map((header) => {
              if (header.hasDropdown) {
                return (
                  <div
                    key={header.label}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="text-black hover:text-[#d44c39] cursor-pointer"
                      onClick={() =>
                        setIsMobileProductsDropdownOpen(
                          !isMobileProductsDropdownOpen
                        )
                      }
                    >
                      {header.label}
                    </div>
                    {isMobileProductsDropdownOpen && (
                      <div className="mt-4 flex flex-col items-center space-y-4 text-[16px]">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="text-black font-semibold">
                            {productsDropdownItems.consumerProducts.label}
                          </div>
                          {productsDropdownItems.consumerProducts.items.map(
                            (item) => (
                              <a
                                key={item.path}
                                className="text-black hover:text-[#d44c39] cursor-pointer pl-4"
                                onClick={() => handleNavigation(item.path)}
                              >
                                {item.label}
                              </a>
                            )
                          )}
                        </div>
                        <a
                          className="text-black hover:text-[#d44c39] cursor-pointer"
                          onClick={() =>
                            handleNavigation(
                              productsDropdownItems.cameraLensSystems.path
                            )
                          }
                        >
                          {productsDropdownItems.cameraLensSystems.label}
                        </a>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <a
                  key={header.label}
                  className="text-black hover:text-[#d44c39] cursor-pointer"
                  onClick={() => handleNavigation(header.path)}
                >
                  {header.label}
                </a>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
};

export default Header;
