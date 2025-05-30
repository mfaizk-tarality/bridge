import { cn } from "@/lib/utils";
import React from "react";

const CustomDivider = ({ className }) => {
  return <div className={cn("w-full border-b border-stroke", className)}></div>;
};

export default CustomDivider;
