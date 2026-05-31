import React from "react";
import { IconUserFilled, IconStarFilled } from "@tabler/icons-react";
import IRContainer from "@/layouts/investor-relations/container";
import data from "@/constants/committee-composition.json";

const MemberIcon = () => (
  <IconUserFilled size={22} className="text-[#231F20]" />
);

const ChairIcon = () => (
  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-[#231F20]">
    <IconStarFilled size={14} className="text-[#231F20]" />
  </div>
);

const RoleCell = ({ role }) => (
  <div className="flex items-center justify-center">
    {role === "chair" ? (
      <ChairIcon />
    ) : role === "member" ? (
      <MemberIcon />
    ) : null}
  </div>
);

const Legend = ({ className = "" }) => (
  <div className={`flex flex-wrap items-center gap-6 md:gap-12 ${className}`}>
    <div className="flex items-center gap-3">
      <MemberIcon />
      <span className="futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black">
        Committee Member
      </span>
    </div>
    <div className="flex items-center gap-3">
      <ChairIcon />
      <span className="futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black">
        Committee Chair
      </span>
    </div>
  </div>
);

const CommitteeComposition = () => {
  const committees = data.committees || [];
  const members = data.members || [];
  const gridTemplate = `minmax(180px,1fr) repeat(${committees.length}, minmax(180px,1fr))`;

  return (
    <IRContainer className="py-12 md:py-16 lg:py-20">
      <h2 className="futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6">
        Committee Composition
      </h2>

      {/* Mobile: legend on top */}
      <Legend className="mt-6 lg:hidden" />

      {/* Mobile: 3 separate sub-tables (<lg) */}
      <div className="mt-6 lg:hidden flex flex-col gap-8">
        {committees.map((committee) => (
          <div key={committee.id}>
            <div className="grid grid-cols-2 gap-x-4 py-4 px-4 bg-[#F0F0F0]">
              <div className="futura-medium font-medium text-[15px] text-[#231F20]">
                Board Members
              </div>
              <div className="futura-medium font-medium text-[15px] text-[#231F20] text-center">
                {committee.label}
              </div>
            </div>
            {members.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-2 gap-x-4 items-center py-4 px-4 border-b border-[#E0E1E0]"
              >
                <div className="futura-medium font-medium text-[14px] text-black">
                  {member.name}
                </div>
                <RoleCell role={member.roles?.[committee.id]} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: single 4-column table (lg+) */}
      <div className="mt-8 md:mt-10 hidden lg:block overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            className="grid items-center gap-x-6 py-4 px-4 bg-[#F0F0F0]"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20]">
              Board Members
            </div>
            {committees.map((c) => (
              <div
                key={c.id}
                className="futura-condensed-medium font-medium text-[16px] md:text-[18px] xl:text-[24px] text-[#231F20] text-center"
              >
                {c.label}
              </div>
            ))}
          </div>

          {members.map((member) => (
            <div
              key={member.id}
              className="grid items-center gap-x-6 py-4 px-4 border-b border-[#E0E1E0]"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <div className="futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black">
                {member.name}
              </div>
              {committees.map((c) => (
                <RoleCell key={c.id} role={member.roles?.[c.id]} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: legend at bottom */}
      <Legend className="hidden lg:flex mt-6 md:mt-8 px-4" />
    </IRContainer>
  );
};

export default CommitteeComposition;
