import { IconChecks, IconCopy } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copiedHandler = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
      toast.success("Text copied successfully");
    } catch (error) {
      console.log(error);
      setCopied(false);
    }
  };

  return (
    <button onClick={copiedHandler} className="cursor-pointer">
      <AnimatePresence>
        {copied ? (
          <motion.div className="" exit={{ opacity: 0 }}>
            <IconChecks />
          </motion.div>
        ) : (
          <motion.div exit={{ opacity: 0 }} className="flex items-center">
            <IconCopy />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default CopyButton;
