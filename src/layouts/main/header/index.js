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

const Header = ({ background = "#F0F0F0" }) => {
  const dropdownItems = getDropdownItems();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  // Generic dropdown state management
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredSubmenus, setHoveredSubmenus] = useState({});
  const [mobileOpenDropdowns, setMobileOpenDropdowns] = useState({});
  const [mobileOpenSubmenus, setMobileOpenSubmenus] = useState({});
  // Header is transparent/white at the top, switches to the solid bg on scroll
  const [isScrolled, setIsScrolled] = useState(false);
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
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdownKey]: true,
      // Close the full-width verticals mega menu when hovering another dropdown
      ...(dropdownKey !== "verticals" ? { verticals: false } : {}),
    }));
  };

  const closeVerticalsMenu = () => {
    setOpenDropdowns((prev) => ({ ...prev, verticals: false }));
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
    // Accordion: only one submenu open at a time (opening one closes the rest)
    setMobileOpenSubmenus((prev) => ({
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

  const getDropdownPanelClass = (dropdownKey) => {
    if (dropdownKey === "investorRelations") {
      return "bg-white shadow-lg border border-gray-200 py-2 min-w-[140px] w-max";
    }
    return "bg-white shadow-lg border border-gray-200 py-2 min-w-[300px]";
  };

  const getSubmenuPanelClass = (dropdownKey, itemKey) => {
    if (dropdownKey === "investorRelations" && itemKey === "singaporeExchange") {
      return "bg-white shadow-lg border border-gray-200 min-w-[280px] w-max py-2";
    }
    return "bg-white shadow-lg border border-gray-200 min-w-[230px] py-2";
  };

  // Helper function to render dropdown menu
  const renderDropdownMenu = (dropdownKey) => {
    const items = dropdownItems[dropdownKey];
    if (!items) return null;

    const isOpen = openDropdowns[dropdownKey];

    return (
      isOpen && (
        <div className="absolute top-full left-0 pt-2 z-[100] pointer-events-auto">
          <div className={getDropdownPanelClass(dropdownKey)}>
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
                        "px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between whitespace-nowrap",
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
                        <div className={getSubmenuPanelClass(dropdownKey, key)}>
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.path}
                              href={subItem.path}
                              className={clsx(
                                "block px-4 py-2 hover:bg-gray-50 cursor-pointer text-[16px] futura-medium whitespace-nowrap",
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
                    "block px-4 py-2 hover:bg-gray-50 cursor-pointer text-[16px] futura-medium whitespace-nowrap",
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

  // Helper function to render the full-width verticals mega menu (desktop)
  const renderVerticalsMegaMenu = () => {
    const items = dropdownItems.verticals;
    if (!items || !openDropdowns.verticals) return null;

    const chevron = (
      <svg
        className="w-4 h-4 ml-2 shrink-0"
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
    );

    return (
      <div className="absolute left-0 top-full w-full z-[100] bg-white shadow-lg border-t border-gray-200">
        <div className="mx-auto w-full max-w-[1600px] flex gap-[40px] px-[24px] py-[40px] xl:px-[72px]">
          {/* Left intro column */}
          <div className="flex flex-col w-[240px] shrink-0">
            <span className="text-[32px] futura-medium text-black">
              Explore All Verticals
            </span>
            <span className="mt-[12px] text-[16px] futura-medium text-[#7D7D7D]">
              One platform, end to end
            </span>
            <Link
              href="/verticals/overview"
              onClick={handleMenuClose}
              className="mt-[32px] inline-flex w-fit items-center justify-center rounded-full bg-[#d44c39] px-[32px] py-[12px] text-[14px] tracking-[0.1em] uppercase text-white futura-medium hover:opacity-90 transition-opacity"
            >
              Learn More
            </Link>
          </div>

          {/* Category columns */}
          <div className="flex flex-1 gap-[24px]">
            {Object.entries(items).map(([key, item]) => (
              <div key={key} className="flex flex-col w-[262px]">
                <div className="w-[262px] h-[148px] bg-[#F4F4F4] flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width="0"
                    height="0"
                    className="w-auto h-[80px]"
                  />
                </div>
                <Link
                  href={item.path}
                  onClick={handleMenuClose}
                  className={clsx(
                    "mt-[20px] text-[22px] futura-medium hover:text-[#d44c39] transition-colors",
                    isItemActive(item) ? "text-[#d44c39]" : "text-black"
                  )}
                >
                  {item.label}
                </Link>
                <div className="mt-[12px] flex flex-col">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.path}
                      onClick={handleMenuClose}
                      className={clsx(
                        "flex items-center justify-between py-[6px] text-[18px] futura-medium hover:text-[#d44c39] transition-colors",
                        subItem.path !== "#" && isSubItemActive(subItem.path)
                          ? "text-[#d44c39]"
                          : "text-[#747474]"
                      )}
                    >
                      <span>{subItem.label}</span>
                      {chevron}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render mobile dropdown menu
  // Mobile verticals menu: full-width list with category icon cards + sub-items
  const renderMobileVerticalsMenu = () => {
    const items = dropdownItems.verticals;
    if (!items || !mobileOpenDropdowns.verticals) return null;

    const chevronRight = (color) => (
      <svg
        className="w-5 h-5 shrink-0"
        fill="none"
        stroke={color}
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    );

    return (
      <div className="mt-[14px] w-full flex flex-col gap-[24px]">
        {/* Explore All Verticals */}
        <Link
          href="/verticals/overview"
          onClick={handleMenuClose}
          className="flex items-center justify-between w-full border-b border-[#D3D0D0] border-opacity-50 pb-[12px] text-[18px] futura-medium text-[#111111]"
        >
          <span>Explore All Verticals</span>
          {chevronRight("#111111")}
        </Link>

        {Object.entries(items).map(([key, category]) => {
          const submenuKey = `verticals-${key}`;
          const isCatOpen = mobileOpenSubmenus[submenuKey];
          const isCatActive = isItemActive(category);
          const catColor = isCatActive || isCatOpen ? "#D34C39" : "#111111";

          return (
            <div key={key} className="flex flex-col w-full">
              {/* Category title toggle */}
              <div
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={() => toggleMobileSubmenu(submenuKey)}
              >
                <span className="text-[18px] futura-medium" style={{ color: catColor }}>
                  {category.label}
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isCatOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke={catColor}
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isCatOpen && (
                <>
                  {/* Icon card */}
                  <div className="mt-[16px] flex h-[120px] w-full items-center justify-center rounded-[4px] bg-[#F4F4F4]">
                    <Image
                      src={category.icon}
                      alt={category.label}
                      width="0"
                      height="0"
                      className="w-auto h-[60px]"
                    />
                  </div>

                  {/* Sub-items */}
                  <div className="mt-[12px] flex flex-col">
                    {category.items.map((subItem) => {
                      const active =
                        subItem.path !== "#" && isSubItemActive(subItem.path);
                      return (
                        <Link
                          key={subItem.label}
                          href={subItem.path}
                          onClick={handleMenuClose}
                          className={clsx(
                            "flex items-center justify-between w-full border-b border-[#D3D0D0] border-opacity-50 py-[12px] text-[16px] futura-medium",
                            active ? "text-[#D34C39]" : "text-[#747474]"
                          )}
                        >
                          <span>{subItem.label}</span>
                          {chevronRight(active ? "#D34C39" : "#747474")}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

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
                    <div
                      className={clsx(
                        "flex flex-col mx-auto",
                        dropdownKey === "investorRelations" && key === "singaporeExchange"
                          ? "w-full max-w-[320px]"
                          : "w-[296px]"
                      )}
                    >
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
    // Verticals is active on the overview page and any sub-page under /verticals
    if (header.dropdownKey === "verticals") {
      return pathName === "/verticals" || pathName.startsWith("/verticals/");
    }
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
      // Special case: company announcement detail pages (SGX)
      if (header.dropdownKey === "investorRelations") {
        return pathName.startsWith("/company-announcement/");
      }
    }
    return pathName === header.path || 
           (header.path === "/verticals" && pathName.startsWith("/verticals/"));
  };

  return (
    <div
      className="sticky top-0 z-[100] transition-colors duration-300 font-bold flex justify-between items-center mx-auto xl:px-[72px] xl:py-[44px] px-[24px] py-[20px] w-full"
      style={{
        backgroundColor: isScrolled ? background : "#ffffff",
      }}
      onMouseLeave={() =>
        setOpenDropdowns((prev) => ({ ...prev, verticals: false }))
      }
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
                    onMouseLeave={
                      header.dropdownKey === "verticals"
                        ? undefined
                        : () => handleDropdownMouseLeave(header.dropdownKey)
                    }
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

                    {/* Generic Dropdown Menu (verticals uses the full-width mega menu rendered at header root) */}
                    {header.dropdownKey !== "verticals" && renderDropdownMenu(header.dropdownKey)}
                  </div>
                );
              }

              return header.path.startsWith("/") ? (
                <Link
                  key={header.label}
                  href={header.path}
                  onMouseEnter={closeVerticalsMenu}
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
                  onMouseEnter={closeVerticalsMenu}
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

      {/* Full-width verticals mega menu (desktop) */}
      {!isMobile && renderVerticalsMegaMenu()}

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
                      {header.dropdownKey === "verticals"
                        ? renderMobileVerticalsMenu()
                        : renderMobileDropdownMenu(header.dropdownKey)}
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
