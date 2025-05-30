import { api, bridge } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";

export const useBridgeHistory = ({ address }) => {
  return useQuery({
    queryKey: ["bridgeHistory", address],
    queryFn: async () => {
      return getBridgeTransactionHistory(address);
    },
    select: (data) => {
      if (data?.responseCode == 200) {
        return data?.result?.rows;
      }
      return [];
    },
  });
};

export const getBridgeTransactionHistory = async (address) => {
  try {
    const response = await api({
      url: `${bridge}/userBurnTokenList`,
      method: "GET",
      params: {
        walletAddress: address,
      },
    });
    return response?.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
