import { formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { erc20Abi } from "viem";
import { useBalance, useReadContract } from "wagmi";

/**
 * Hook to fetch token balance (Native or ERC-20)
 * @param {Object} params
 * @param {string} params.tokenAddress - ERC-20 token address (if applicable)
 * @param {number} params.chainId - Chain ID of the token
 * @param {string} params.userAddress - Wallet address to check balance
 */
export const useTokenBalance = ({ tokenAddress, chainId, userAddress }) => {
  const isNative = !tokenAddress;

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    data: nativeBalance,
    isError: nativeError,
    isLoading: nativeLoading,
    refetch: refetchNative,
  } = useBalance({
    address: userAddress,
    chainId,
    enabled: isNative,
  });

  const {
    data: tokenBalance,
    isError: tokenError,
    isLoading: tokenLoading,
    refetch: refetchToken,
  } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress],
    chainId,
    enabled: !!tokenAddress,
  });

  const fetchBalance = useCallback(() => {
    if (isNative) {
      refetchNative();
    } else {
      refetchToken();
    }
  }, [isNative, refetchNative, refetchToken]);

  useEffect(() => {
    setLoading(isNative ? nativeLoading : tokenLoading);

    if (isNative) {
      if (nativeError) {
        setError("Failed to fetch native token balance");
      } else {
        setBalance(
          nativeBalance?.value
            ? formatUnits(nativeBalance?.value?.toString()).slice(0, 6)
            : 0
        );
        setError(null);
      }
    } else {
      if (tokenError) {
        setError("Failed to fetch ERC-20 balance");
      } else {
        setBalance(
          tokenBalance ? formatUnits(tokenBalance?.toString()).slice(0, 6) : 0
        );
        setError(null);
      }
    }
  }, [
    isNative,
    nativeBalance,
    nativeLoading,
    nativeError,
    tokenBalance,
    tokenLoading,
    tokenError,
  ]);

  return { balance, loading, error, refetch: fetchBalance };
};
