import React from "react";

const IRContainer = React.forwardRef(
  ({ children, className = "", as: Component = "section" }, ref) => (
    <Component
      ref={ref}
      className={`w-full px-[24px] xl:px-[84px] ${className}`}
    >
      {children}
    </Component>
  ),
);

IRContainer.displayName = "IRContainer";

export default IRContainer;
