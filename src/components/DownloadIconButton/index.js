"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const ArrowCircleDown = ({ className }) => (
  <svg
    className={clsx("w-8 h-8 shrink-0", className)}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M16 9v11M11 16.5L16 21.5l5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = ({ open, className }) => (
  <svg
    className={clsx(
      "w-4 h-4 shrink-0 transition-transform duration-200",
      open && "rotate-180",
      className
    )}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const buttonVariantClass = (variant) =>
  clsx(
    "inline-flex items-center justify-center gap-2 px-10 py-2 rounded-[33px] futura-medium tracking-[2px] uppercase text-[16px] transition-opacity hover:opacity-90 border border-solid",
    variant === "filled" && "bg-[#d34c39] border-white text-white",
    variant === "light" && "bg-[#BE4533] border-white text-white"
  );

const triggerDownload = (href, fileName) => {
  if (!href) return;
  if (
    href.toLowerCase().endsWith(".pdf") ||
    href.toLowerCase().endsWith(".exe") ||
    href.toLowerCase().endsWith(".zip")
  ) {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.open(href, "_blank");
  }
};

const DownloadIconButton = ({
  label,
  href,
  download,
  onClick,
  variant = "filled",
  className,
  type = "button",
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    triggerDownload(href, download);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={clsx(buttonVariantClass(variant), className)}
    >
      <ArrowCircleDown />
      <span>{label}</span>
    </button>
  );
};

const DownloadDropdownButton = ({
  label,
  items = [],
  variant = "filled",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={clsx("relative inline-flex", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className={buttonVariantClass(variant)}
      >
        <span>{label}</span>
        <ChevronDown open={open} className="text-white" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-[calc(100%+10px)] z-20 w-max min-w-[calc(100%+24px)] max-w-[min(360px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden rounded-[24px] border border-white/30 bg-white p-2 shadow-[0_16px_48px_rgba(35,31,32,0.22)]"
        >
          <ul className="flex flex-col gap-1">
            {items.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full rounded-[18px] px-4 py-3 text-left futura-medium text-[14px] leading-snug text-[#BE4533] transition-colors hover:bg-[#f7f0ee] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE4533]/30"
                  onClick={() => {
                    triggerDownload(item.link, item?.name || `file-${index + 1}`);
                    setOpen(false);
                  }}
                >
                  {item?.name || `Link ${index + 1}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { triggerDownload, DownloadDropdownButton };
export default DownloadIconButton;
