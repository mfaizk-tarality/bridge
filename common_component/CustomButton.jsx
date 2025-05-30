"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAppKit } from "@reown/appkit/react";
const CustomButton = ({
  children,
  className,
  clickHandler,
  isLoading = false,
  isConnected = true,
  type = "button",
  disabled = false,
}) => {
  const { open } = useAppKit();
  return (
    <button
      // disabled={disabled}
      className={cn(
        "bg-tancolor px-6 py-2 rounded-4xl cursor-pointer btn border-0",
        className
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        if (!isConnected) {
          open({ view: "Connect" });
        } else {
          if (clickHandler) {
            clickHandler();
          }
        }
      }}
      type={type}
    >
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="loading loading-spinner loading-xs"
            exit={{ opacity: 0 }}
          />
        ) : (
          <motion.div exit={{ opacity: 0 }} className="flex items-center gap-2">
            {isConnected ? <>{children}</> : "Connect Wallet"}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CustomButton;
