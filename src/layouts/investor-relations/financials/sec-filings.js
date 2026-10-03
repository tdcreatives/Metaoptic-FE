"use client";

import React, { useEffect, useRef, useState } from "react";
import { fetchSecFilings } from "@/lib/b2i";
import IRContainer from "@/layouts/investor-relations/container";
import {
  PageButton,
  buildPaginationRange,
} from "@/layouts/investor-relations/news/list-controls";

const ITEMS_PER_PAGE = 10;

const LINK_TYPES = [
  { key: "html", label: "HTML" },
  { key: "pdf", label: "PDF" },
  { key: "doc", label: "RTF" },
  { key: "xls", label: "XLS" },
];

const SelectField = ({ label, value, options, onChange, widthClass = "" }) => (
  <div
    className={`flex flex-col gap-2 ${widthClass || "flex-1 min-w-[180px]"}`}
  >
    <span className="futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888]">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="futura-medium font-medium text-[14px] md:text-[16px] xl:text-[18px] text-[#231F20] border border-[#231F20] rounded-md px-4 py-3 h-[48px] bg-white cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:12px] pr-10"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='%23231F20' d='M1 1l5 5 5-5'/%3E%3C/svg%3E\")",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const LinkPill = ({ label, url }) => {
  if (!url) {
    return (
      <span className="inline-flex items-center justify-center px-[6px] py-[4px] min-w-[48px] bg-[#F5F5F5] border border-[#E0E1E0] text-[12px] md:text-[13px] futura-medium text-[#BFBFBF] rounded-[2px]">
        {label}
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-[6px] py-[4px] min-w-[48px] bg-[#F2F2F2] hover:bg-[#E5E5E5] border border-[#D9D9D9] text-[12px] md:text-[13px] futura-medium text-[#231F20] transition-colors rounded-[2px]"
    >
      {label}
    </a>
  );
};

const SECFilings = () => {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingGroup, setPendingGroup] = useState("");
  const [pendingYear, setPendingYear] = useState("");
  const [appliedGroup, setAppliedGroup] = useState("");
  const [appliedYear, setAppliedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [filingGroups, setFilingGroups] = useState([]);
  const sectionRef = useRef(null);

  const handlePageChange = (p) => {
    if (p === currentPage) return;
    setCurrentPage(p);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFilter = () => {
    setAppliedGroup(pendingGroup);
    setAppliedYear(pendingYear);
    setCurrentPage(1);
  };

  useEffect(() => {
    const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
    const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;

    let cancelled = false;
    (async () => {
      const result = await fetchSecFilings({
        bizId,
        apiKey,
        page: currentPage,
        year: appliedYear,
        type: appliedGroup,
        count: ITEMS_PER_PAGE,
      });
      if (cancelled) return;
      setItems(result.items);
      setTotalPages(result.totalPages);
      if (result.availableYears.length > 0)
        setAvailableYears(result.availableYears);
      if (result.filingGroups.length > 0) setFilingGroups(result.filingGroups);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPage, appliedGroup, appliedYear]);

  const startIndex =
    items.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endIndex = (currentPage - 1) * ITEMS_PER_PAGE + items.length;
  const totalApprox =
    currentPage >= totalPages
      ? endIndex
      : Math.max(endIndex, totalPages * ITEMS_PER_PAGE);

  const yearOptions = [
    { value: "", label: "All" },
    ...availableYears.map((y) => ({ value: String(y), label: String(y) })),
  ];

  const groupOptions =
    filingGroups.length > 0 ? filingGroups : [{ value: "", label: "All" }];

  return (
    <IRContainer
      ref={sectionRef}
      className="py-12 md:py-16 lg:py-20 scroll-mt-24"
    >
      <h2 className="futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6">
        SEC Filings
      </h2>

      <div className="flex flex-wrap items-end gap-4 md:gap-6 mt-8 md:mt-10">
        <SelectField
          label="Group"
          value={pendingGroup}
          options={groupOptions}
          onChange={setPendingGroup}
          widthClass="w-full md:w-auto xl:w-[472px]"
        />
        <SelectField
          label="Filing year"
          value={pendingYear}
          options={yearOptions}
          onChange={setPendingYear}
          widthClass="w-full md:w-auto xl:w-[182px]"
        />
        <button
          type="button"
          onClick={handleFilter}
          className="futura-medium uppercase tracking-wider text-[14px] md:text-[16px] text-white bg-[#d34c39] hover:bg-[#231f20] focus:outline-none px-10 py-3 rounded-md transition-colors whitespace-nowrap leading-none h-[48px]"
        >
          Filter
        </button>
      </div>

      {/* Mobile: stacked card layout (<lg) */}
      <div className="mt-8 md:mt-10 lg:hidden">
        {items.length === 0 ? (
          <div className="py-12 text-center text-[#888888] futura-medium">
            No SEC filings found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#F7F7F7] p-4 flex flex-col gap-3"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="futura-medium text-[12px] text-[#888888]">
                      Filling Date
                    </span>
                    <span className="futura-medium font-medium text-[15px] text-[#231F20]">
                      {item.date}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="futura-medium text-[12px] text-[#888888]">
                      Form
                    </span>
                    <span className="futura-medium font-medium text-[15px] text-[#231F20]">
                      {item.form}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="futura-medium text-[12px] text-[#888888]">
                    Description
                  </span>
                  <span className="futura-medium font-medium text-[15px] text-[#231F20]">
                    {item.description}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="futura-medium text-[12px] text-[#888888]">
                    Filling Group
                  </span>
                  <span className="futura-medium font-medium text-[15px] text-[#231F20]">
                    {item.group}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="futura-medium text-[12px] text-[#888888]">
                    View
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {LINK_TYPES.map((linkType) => (
                      <LinkPill
                        key={linkType.key}
                        label={linkType.label}
                        url={item.links?.[linkType.key]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid table (lg+) */}
      <div className="mt-8 md:mt-10 hidden lg:block overflow-x-auto">
        <div className="min-w-[920px]">
          <div className="grid grid-cols-[140px_120px_1fr_160px_220px] gap-x-6 py-4 px-4 bg-[#F0F0F0]">
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              Filing Date
            </div>
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              Form
            </div>
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              Description
            </div>
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              Filing Group
            </div>
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              View
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-[#888888] futura-medium">
              No SEC filings found.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[140px_120px_1fr_160px_220px] gap-x-6 items-center py-4 px-4 border-b border-[#E0E1E0]"
              >
                <div className="futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#231F20]">
                  {item.date}
                </div>
                <div className="futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#231F20]">
                  {item.form}
                </div>
                <div className="futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#231F20]">
                  {item.description}
                </div>
                <div className="futura-medium font-medium text-[13px] md:text-[14px] xl:text-[16px] text-[#231F20]">
                  {item.group}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {LINK_TYPES.map((linkType) => (
                    <LinkPill
                      key={linkType.key}
                      label={linkType.label}
                      url={item.links?.[linkType.key]}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div
          className={`flex flex-wrap items-center gap-4 mt-10 md:mt-12 ${
            totalPages > 1 ? "justify-between" : "justify-center md:justify-end"
          }`}
        >
          {totalPages > 1 && (
            <div className="flex items-center gap-2 md:gap-3">
              {buildPaginationRange(currentPage, totalPages).map((p, idx) =>
                p === "…" ? (
                  <span key={`e-${idx}`} className="text-[#888888] px-1">
                    …
                  </span>
                ) : (
                  <PageButton
                    key={p}
                    active={p === currentPage}
                    onClick={() => handlePageChange(p)}
                    ariaLabel={`Go to page ${p}`}
                  >
                    {p}
                  </PageButton>
                ),
              )}
              <PageButton
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                ariaLabel="Next page"
              >
                ›
              </PageButton>
            </div>
          )}
          <div className="futura-medium text-[13px] md:text-[14px] text-[#888888]">
            Showing {startIndex}-{endIndex} of {totalApprox} results
          </div>
        </div>
      )}
    </IRContainer>
  );
};

export default SECFilings;
