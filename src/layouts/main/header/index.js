"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Image from "next/image";
import { gsap } from "gsap";
import { isMobile } from "react-device-detect";
import BaseHamburger from "@/components/BaseHamburger";
import BaseMobileHamburger from "@/components/BaseHamburger/MobileHamburger";
import { headers, getDropdownItems } from "./constants";
import clsx from "clsx";

const Header = ({ background = "#fff" }) => {
  const dropdownItems = getDropdownItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  // Generic dropdown state management
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredSubmenus, setHoveredSubmenus] = useState({});
  const [mobileOpenDropdowns, setMobileOpenDropdowns] = useState({});
  const [mobileOpenSubmenus, setMobileOpenSubmenus] = useState({});
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
    if (isMenuOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

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
    setMobileOpenSubmenus({});
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

  const toggleMobileSubmenu = (submenuKey) => {
    setMobileOpenSubmenus((prev) => ({
      ...prev,
      [submenuKey]: !prev[submenuKey],
    }));
  };

  const isItemActive = (item) => {
    if (item.path && (pathName === item.path || pathName.startsWith(item.path + "/"))) {
      return true;
    }
    if (item.items) {
      return item.items.some((subItem) => pathName === subItem.path || pathName.startsWith(subItem.path + "/"));
    }
    return false;
  };

  const isSubItemActive = (path) => {
    return pathName === path || pathName.startsWith(path + "/");
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
                const active = isItemActive(item);

                return (
                  <div
                    key={key}
                    className="relative"
                    onMouseEnter={() => handleSubmenuMouseEnter(dropdownKey, key)}
                    onMouseLeave={() => handleSubmenuMouseLeave(dropdownKey, key)}
                  >
                    <Link
                      href={item.path || "#"}
                      onClick={handleMenuClose}
                      className={clsx(
                        "px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between",
                        isSubmenuHovered || active ? "text-[#d44c39]" : "text-black"
                      )}
                    >
                      <span className="text-[16px] futura-medium">{item.label}</span>
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
                    </Link>

                    {/* Sub-menu */}
                    {isSubmenuHovered && (
                      <div className="absolute left-full top-0 pl-2 z-[110]">
                        <div className="bg-white shadow-lg border border-gray-200 min-w-[230px] py-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={clsx(
                                "block px-4 py-2 hover:bg-gray-50 cursor-pointer text-[16px] futura-medium",
                                isSubItemActive(subItem.path) ? "text-[#d44c39]" : "text-black hover:text-[#d44c39]"
                              )}
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

              const active = isItemActive(item);
              // Simple link item
              return (
                <Link
                  key={key}
                  href={item.path}
                  className={clsx(
                    "block px-4 py-2 hover:bg-gray-50 cursor-pointer text-[16px] futura-medium",
                    active ? "text-[#d44c39]" : "text-black hover:text-[#d44c39]"
                  )}
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
        <div className="mt-[14px] w-full flex flex-col gap-[8px]">
          {Object.entries(items).map(([key, item], index) => {
            // Check if item has sub-items
            if (item.items && Array.isArray(item.items)) {
              const submenuKey = `${dropdownKey}-${key}`;
              const isSubmenuOpen = mobileOpenSubmenus[submenuKey];

              const active = isItemActive(item);

              return (
                <div key={key} className="flex flex-col w-full gap-[8px]">
                  <div 
                    className="flex items-center justify-between w-full border-b border-[#D3D0D0] border-opacity-50 pb-0"
                  >
                    <Link
                      href={item.path || "#"}
                      onClick={handleMenuClose}
                      className={clsx(
                        "text-[20px] leading-[3.75em] tracking-[0.1em] futura-medium flex-1",
                        active || isSubmenuOpen ? "text-[#D34C39]" : "text-[#111111]"
                      )}
                    >
                      {item.label}
                    </Link>
                    <div 
                      className="cursor-pointer p-2 -mr-2"
                      onClick={() => toggleMobileSubmenu(submenuKey)}
                    >
                      <svg
                        className={`w-6 h-6 transition-transform duration-300 ${
                          isSubmenuOpen ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke={active || isSubmenuOpen ? "#D34C39" : "#111111"}
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {isSubmenuOpen && (
                    <div className="flex flex-col w-[296px] mx-auto">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={clsx(
                            "text-[16px] leading-[4.285714em] tracking-[0.114em] futura-medium border-b border-[#D3D0D0] border-opacity-50 pb-0 hover:opacity-80 transition-opacity",
                            isSubItemActive(subItem.path) ? "text-[#D34C39]" : "text-[#111111]"
                          )}
                          onClick={handleMenuClose}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const active = isItemActive(item);
            // Simple link item
            return (
              <Link
                key={key}
                href={item.path}
                className={clsx(
                  "text-[20px] leading-[3.75em] tracking-[0.1em] futura-medium border-b border-[#D3D0D0] border-opacity-50 pb-0 hover:opacity-80 transition-opacity",
                  active ? "text-[#D34C39]" : "text-[#111111]"
                )}
                onClick={handleMenuClose}
              >
                {item.label}
              </Link>
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
           (header.path === "/verticals" && pathName.startsWith("/verticals/"));
  };

  return (
    <div
      className="relative z-[100] font-bold flex justify-between items-center mx-auto xl:px-[72px] xl:py-[44px] px-[24px] py-[20px] w-full"
      style={{
        background,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        onClick={handleMenuClose}
        className="!opacity-100 hover:!opacity-100"
        style={{ opacity: 1 }}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width="0"
          height="0"
          className="xl:w-[20vw] w-[200px] h-auto cursor-pointer !opacity-100 hover:!opacity-100"
          style={{ opacity: 1 }}
          priority
        />
      </Link>

      {!isMobile && (
        <div className="flex justify-between items-center space-x-4">
          {/* Navigation Bar */}
          <nav
            className="hidden xl:flex space-x-8 text-[18px] uppercase overflow-visible futura-medium font-medium"
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
                        href={header.label === "VERTICALS" ? "#" : header.path}
                        className={`relative z-[1001] text-black hover:text-[#d44c39] hover:after:w-2 cursor-pointer after:block after:h-1 after:w-0 after:bg-[#d44c39] after:rounded-full after:mx-auto ${
                          isPathActive(header) ? "after:!w-2 !text-[#d44c39]" : ""
                        }`}
                        onClick={(e) => {
                          if (header.label === "VERTICALS") {
                            e.preventDefault();
                          }
                          handleMenuClose();
                        }}
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
            className="fixed top-0 right-0 h-full w-full bg-white flex flex-col space-y-8  z-[10000] futura-medium overflow-y-auto pb-10"
            ref={menuRef}
          >
            <div className="absolute top-[24px] right-[24px] cursor-pointer">
              <BaseMobileHamburger
                className="open"
                onClick={handleMobileMenuToggle}
              />
            </div>
            <div className="flex flex-col gap-[30px] w-full">
              {headers.map((header) => {
                if (header.dropdownKey) {
                  const isOpen = mobileOpenDropdowns[header.dropdownKey];
                  return (
                    <div
                      key={header.label}
                      className="flex flex-col w-full max-w-[318px] mx-auto"
                    >
                      <div
                        className={`flex items-center justify-between w-full border-b pb-0 cursor-pointer ${
                          isOpen ? 'border-[#D34C39]' : 'border-[#D3D0D0]'
                        }`}
                        onClick={() => toggleMobileDropdown(header.dropdownKey)}
                      >
                        <span className={`text-[20px] leading-[3em] uppercase tracking-[0.08em] text-center futura-medium ${
                          isOpen ? 'text-[#D34C39]' : 'text-[#111111]'
                        }`}>
                          {header.label}
                        </span>
                        <svg
                          className={`w-6 h-6 transition-transform duration-300 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke={isOpen ? '#D34C39' : '#111111'}
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      {renderMobileDropdownMenu(header.dropdownKey)}
                    </div>
                  );
                }
                return header.path.startsWith("/") ? (
                  <Link
                    key={header.label}
                    href={header.path}
                    className="text-[#111111] text-[20px] leading-[3em] uppercase tracking-[0.08em] futura-medium border-b border-[#D3D0D0] pb-0 hover:text-[#d44c39] transition-colors max-w-[318px] mx-auto w-full"
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
                    className="text-[#111111] text-[20px] leading-[3em] uppercase tracking-[0.08em] futura-medium border-b border-[#D3D0D0] pb-0 hover:text-[#d44c39] transition-colors max-w-[318px] mx-auto w-full"
                    onClick={handleMenuClose}
                  >
                    {header.label}
                  </a>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
};

export default Header;
