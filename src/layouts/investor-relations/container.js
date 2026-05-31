import React from "react";

const IRContainer = React.forwardRef(
  ({ children, className = "", as: Component = "section", id, ...rest }, ref) => (
    <Component
      ref={ref}
      id={id}
      className={`w-full px-[24px] xl:px-[84px] ${className}`}
      {...rest}
    >
      {children}
    </Component>
  ),
);

IRContainer.displayName = "IRContainer";

export default IRContainer;
