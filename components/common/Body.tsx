import React from "react";
import parser from "html-react-parser";
import { twMerge } from "tailwind-merge";

export const Body = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => {
  return <div className={twMerge("", className)}>{parser(children)}</div>;
};
