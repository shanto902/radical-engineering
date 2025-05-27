import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const PaddingContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={twMerge("max-w-7xl mx-auto px-4", className)}>
      {children}
    </div>
  );
};

export default PaddingContainer;
