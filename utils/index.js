import CopyButton from "@/common_component/CopyButton";
import { toast } from "sonner";

export const adjustOpacity = (rgbaString, newOpacity) => {
  const rgbaRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([0-9\.]*)\)/i;
  const match = rgbaString.match(rgbaRegex);

  if (!match) {
    throw new Error("Invalid RGBA format");
  }

  const r = match[1];
  const g = match[2];
  const b = match[3];

  const alpha = Math.max(0, Math.min(1, newOpacity));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function maskValue({ str, enableCopyButton = false }) {
  if (!str) return "";

  const len = str.length;
  const keep = Math.floor(len * 0.3);
  const start = Math.ceil(keep / 3);
  const end = Math.floor(keep / 3);

  return (
    <span className="flex gap-2">
      {str.slice(0, start)}...{str.slice(-end)}
      {enableCopyButton && (
        <span>
          <CopyButton text={str} />
        </span>
      )}
    </span>
  );
}
export const useAddToken = () => {
  const addToken = async ({
    tokenAddress,
    tokenSymbol,
    tokenDecimals,
    tokenImage,
  }) => {
    try {
      if (!window.ethereum) return;
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error, "error>>>>>");
      toast.error(error?.message || "Something went wrong");
    }
  };

  return { addToken };
};
