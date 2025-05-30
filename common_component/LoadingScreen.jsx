import { cn } from "@/lib/utils";
import React from "react";

const LoadingScreen = ({ className, text }) => {
  return (
    <div
      className={cn(
        "min-h-full min-w-full flex items-center justify-center flex-col",
        className
      )}
    >
      <span className="loading loading-infinity loading-xl"></span>
      <p> {text || "Getting Data...."}</p>
    </div>
  );
};

export default LoadingScreen;
