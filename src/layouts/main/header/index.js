"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Image from "next/image";
import { gsap } from "gsap";
import { isMobile } from "react-device-detect";
import BaseHamburger from "@/components/BaseHamburger";
import BaseMobileHamburger from "@/components/BaseHamburger/MobileHamburger";
import { headers, dropdownItems } from "./constants";
import clsx from "clsx";

const Header = ({ background = "#fff" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  // Generic dropdown state management
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredSubmenus, setHoveredSubmenus] = useState({});
  const [mobileOpenDropdowns, setMobileOpenDropdowns] = useState({});
  const pathName = usePathname();

  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);
  const menuItemRef = useRef(null);

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
    if (!menuRef.current) return;

    if (isMenuOpen) {
      // Closing menu
      gsap.to(menuRef.current, {
        x: "100%",
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuOpen(false);
        },
      });
    } else {
      // Opening menu
      setIsMenuOpen(true);
      gsap.set(menuRef.current, { x: "100%", autoAlpha: 0 });
      // Use requestAnimationFrame to ensure state is updated
      requestAnimationFrame(() => {
        if (menuRef.current) {
          gsap.to(menuRef.current, {
            x: "0%",
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    }
  };

  useEffect(() => {
    if (menuItemRef.current) {
      gsap.set(menuItemRef.current, {
        x: "100%",
        autoAlpha: 0,
      });
    }
    if (menuRef.current) {
      gsap.set(menuRef.current, {
        x: "100%",
        autoAlpha: 0,
      });
    }
  }, []);

  const handleMenuClose = () => {
    // Close mobile menu if open
    if (isMenuOpen && menuRef.current) {
      gsap.to(menuRef.current, {
        x: "100%",
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuOpen(false);
        },
      });
    }
    setOpenDropdowns({});
    setHoveredSubmenus({});
    setMobileOpenDropdowns({});
  };

  const handleDropdownMouseEnter = (dropdownKey) => {
    setOpenDropdowns((prev) => ({ ...prev, [dropdownKey]: true }));
  };

  const handleDropdownMouseLeave = (dropdownKey) => {
    setOpenDropdowns((prev) => ({ ...prev, [dropdownKey]: false }));
    setHoveredSubmenus((prev) => ({ ...prev, [dropdownKey]: false }));
  };

  const handleSubmenuMouseEnter = (dropdownKey, submenuKey) => {
    setHoveredSubmenus((prev) => ({
      ...prev,
      [`${dropdownKey}-${submenuKey}`]: true,
    }));
  };

  const handleSubmenuMouseLeave = (dropdownKey, submenuKey) => {
    setHoveredSubmenus((prev) => ({
      ...prev,
      [`${dropdownKey}-${submenuKey}`]: false,
    }));
  };

  const toggleMobileDropdown = (dropdownKey) => {
    setMobileOpenDropdowns((prev) => ({
      ...prev,
      [dropdownKey]: !prev[dropdownKey],
    }));
  };

  // Helper function to render dropdown menu
  const renderDropdownMenu = (dropdownKey) => {
    const items = dropdownItems[dropdownKey];
    if (!items) return null;

    const isOpen = openDropdowns[dropdownKey];

    return (
      isOpen && (
        <div className="absolute top-full left-0 pt-2 z-[100] pointer-events-auto">
          <div className="bg-white shadow-lg border border-gray-200 py-2 min-w-[300px]">
            {Object.entries(items).map(([key, item]) => {
              // Check if item has sub-items (like consumerProducts)
              if (item.items && Array.isArray(item.items)) {
                const submenuKey = `${dropdownKey}-${key}`;
                const isSubmenuHovered = hoveredSubmenus[submenuKey];

                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleSubmenuMouseEnter(dropdownKey, key)}
                    onMouseLeave={() => handleSubmenuMouseLeave(dropdownKey, key)}
                  >
                    <div className="px-4 py-2 text-black hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                      <span>{item.label}</span>
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

                    {/* Sub-menu */}
                    {isSubmenuHovered && (
                      <div className="absolute left-full top-0 pl-2 z-[110]">
                        <div className="bg-white shadow-lg border border-gray-200 min-w-[230px] py-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className="block px-4 py-2 text-black hover:bg-gray-50 hover:text-[#d44c39] cursor-pointer"
                              onClick={handleMenuClose}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Simple link item
              return (
                <Link
                  key={key}
                  href={item.path}
                  className="block px-4 py-2 text-black hover:bg-gray-50 hover:text-[#d44c39] cursor-pointer"
                  onClick={handleMenuClose}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )
    );
  };

  // Helper function to render mobile dropdown menu
  const renderMobileDropdownMenu = (dropdownKey) => {
    const items = dropdownItems[dropdownKey];
    if (!items) return null;

    const isOpen = mobileOpenDropdowns[dropdownKey];

    return (
      isOpen && (
        <div className="mt-4 w-full max-w-[280px] flex flex-col space-y-4 text-[16px]">
          {Object.entries(items).map(([key, item]) => {
            // Check if item has sub-items
            if (item.items && Array.isArray(item.items)) {
              return (
                <div key={key} className="flex flex-col w-full">
                  <div className="text-black font-bold text-[18px] mb-3 px-4 border-b border-gray-300 pb-2">
                    {item.label}
                  </div>
                  <div className="flex flex-col space-y-2 pl-6">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.path}
                        href={subItem.path}
                        className="text-gray-700 hover:text-[#d44c39] cursor-pointer py-2 transition-colors duration-200"
                        onClick={handleMenuClose}
                      >
                        • {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            // Simple link item
            return (
              <div key={key} className="flex flex-col w-full pt-2 border-t border-gray-300">
                <Link
                  href={item.path}
                  className="text-black font-bold text-[18px] hover:text-[#d44c39] cursor-pointer px-4 py-2 transition-colors duration-200"
                  onClick={handleMenuClose}
                >
                  {item.label}
                </Link>
              </div>
            );
          })}
        </div>
      )
    );
  };

  // Helper function to check if path is active
  const isPathActive = (header) => {
    if (header.dropdownKey) {
      const items = dropdownItems[header.dropdownKey];
      if (items) {
        return Object.values(items).some((item) => {
          if (item.path) {
            return pathName === item.path || pathName.startsWith(item.path + "/");
          }
          if (item.items) {
            return item.items.some((subItem) => pathName === subItem.path || pathName.startsWith(subItem.path + "/"));
          }
          return false;
        });
      }
      // Special case: check for announcement pages under investor-relations
      if (header.dropdownKey === "investorRelations") {
        return pathName.startsWith("/annountcement/");
      }
    }
    return pathName === header.path || 
           (header.path === "/products" && pathName.startsWith("/product"));
  };

  return (
    <div
      className="relative z-[100] font-bold flex justify-between items-center mx-auto xl:px-[72px] xl:py-[44px] px-[24px] py-[20px] w-full"
      style={{
        background,
      }}
    >
      {/* Logo */}
      <Link href="/" onClick={handleMenuClose}>
        <Image
          src="/logo.svg"
          alt="Logo"
          width="0"
          height="0"
          className="xl:w-[20vw] w-[200px] h-auto cursor-pointer"
          priority
        />
      </Link>

      {!isMobile && (
        <div className="flex justify-between items-center space-x-4">
          {/* Navigation Bar */}
          <nav
            className="hidden xl:flex space-x-8 text-[16px] uppercase overflow-visible"
            ref={menuItemRef}
          >
            {headers.map((header) => {
              if (header.dropdownKey) {
                return (
                  <div
                    key={header.label}
                    className="relative"
                    onMouseEnter={() => handleDropdownMouseEnter(header.dropdownKey)}
                    onMouseLeave={() => handleDropdownMouseLeave(header.dropdownKey)}
                  >
                    {header.path.startsWith("/") ? (
                      <Link
                        href={header.path}
                        className={`relative z-[1001] text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                          isPathActive(header) ? "after:!w-2 !text-[#d44c39]" : ""
                        }`}
                        onClick={handleMenuClose}
                      >
                        {header.label}
                      </Link>
                    ) : (
                      <a
                        href={header.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative z-[1001] text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                          isPathActive(header) ? "after:!w-2 !text-[#d44c39]" : ""
                        }`}
                        onClick={handleMenuClose}
                      >
                        {header.label}
                      </a>
                    )}

                    {/* Generic Dropdown Menu */}
                    {renderDropdownMenu(header.dropdownKey)}
                  </div>
                );
              }

              return header.path.startsWith("/") ? (
                <Link
                  key={header.label}
                  href={header.path}
                  className={`relative text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                    isPathActive(header) ? "after:!w-2 !text-[#d44c39]" : ""
                  }`}
                  onClick={handleMenuClose}
                >
                  {header.label}
                </Link>
              ) : (
                <a
                  key={header.label}
                  href={header.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                    isPathActive(header) ? "after:!w-2 !text-[#d44c39]" : ""
                  }`}
                  onClick={handleMenuClose}
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
            className="fixed top-0 right-0 h-full w-full bg-white flex flex-col items-center justify-center space-y-8 text-[20px] uppercase z-[10000]"
            ref={menuRef}
          >
            <div className="absolute top-[24px] right-[24px] cursor-pointer">
              <BaseMobileHamburger
                className="open"
                onClick={handleMobileMenuToggle}
              />
            </div>
            {headers.map((header) => {
              if (header.dropdownKey) {
                return (
                  <div
                    key={header.label}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="text-black hover:text-[#d44c39] cursor-pointer"
                      onClick={() => toggleMobileDropdown(header.dropdownKey)}
                    >
                      {header.label}
                    </div>
                    {renderMobileDropdownMenu(header.dropdownKey)}
                  </div>
                );
              }
              return header.path.startsWith("/") ? (
                <Link
                  key={header.label}
                  href={header.path}
                  className="text-black hover:text-[#d44c39] cursor-pointer"
                  onClick={handleMenuClose}
                >
                  {header.label}
                </Link>
              ) : (
                <a
                  key={header.label}
                  href={header.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:text-[#d44c39] cursor-pointer"
                  onClick={handleMenuClose}
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
