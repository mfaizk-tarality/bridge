"use client";
import BreadCrumb from "@/common_component/BreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConfig,
  useSwitchChain,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { IconArrowsExchange2, IconWallet } from "@tabler/icons-react";
import CustomButton from "@/common_component/CustomButton";
import PageTitle from "@/common_component/PageTitle";
import {
  bridgeToken,
  DepositeEtherContractAddress,
  mintContractToken,
  networkList,
} from "@/modules/bridge/config";
import { useTokenBalance } from "@/modules/globals/config";
import { toast } from "sonner";
import { formatNice } from "coin-format";
import { useEthersProvider } from "@/hooks/useEthersProvider";
import { TANConfig } from "@/modules/globals/BlockChainWrapper";
import contractABI from "@/abi/DepositwETH.json";
import { useEthersSigner } from "@/hooks/useEthersSigner";
import { ethers, parseEther, parseUnits } from "ethers";
import MinTokenContractABI from "@/abi/MinTokenContractABI.json";
import {
  getGasPrice,
  waitForTransactionReceipt,
  watchContractEvent,
} from "@wagmi/core";
const breadCrumb = [
  {
    text: "Home",
    href: "/home",
  },
  {
    text: "Bridge",
    href: "/bridge",
  },
];

const Bridge = () => {
  const { isConnected, address } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isLoading, setIsLoading] = useState(false);
  const [btnText, setBtnText] = useState("Transact");
  const tanProvider = useEthersProvider({ chainId: TANConfig.chainId });
  const etherSigner = useEthersSigner();
  const config = useConfig();
  const {
    writeContractAsync,
    status,
    isPending: writeContractPending,
  } = useWriteContract();

  useEffect(() => {
    minContractAdressEventListener();
  }, []);

  function minContractAdressEventListener() {
    const contract = new ethers.Contract(
      mintContractToken.address,
      MinTokenContractABI,
      tanProvider
    );

    try {
      contract.on(
        "Mint",
        async (user, amount, timestamp, blockNumber, txId) => {
          console.log(user, "asdasdas");

          try {
            if (user == address) {
              queryClient.invalidateQueries({ queryKey: ["bridgeHistory"] });
              toast.success("Token minted successfully");
            }
          } catch (error) {
            console.error("Error processing Mint event:", error);
          } finally {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error("Error setting up event listeners:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const [formValue, setFormValue] = useState({
    toNetwork: networkList[0],
    toToken: mintContractToken,
    toAmount: "",
    fromNetwork: networkList[1],
    fromToken: bridgeToken[0],
    fromAmount: "",
  });
  const {
    balance: fromTokenBalance,
    loading: fromTokenBalanceLoading,
    refetch: refetchFromTokenBalance,
  } = useTokenBalance({
    tokenAddress: formValue?.fromToken?.address || undefined,
    chainId: formValue?.fromNetwork?.chainId,
    userAddress: address,
  });
  const {
    balance: toTokenBalance,
    loading: toTokenBalanceLoading,
    refetch: refetchToTokenBalance,
  } = useTokenBalance({
    tokenAddress: formValue?.toToken?.address || undefined,
    chainId: formValue?.toNetwork?.chainId,
    userAddress: address,
  });

  useEffect(() => {
    if (formValue.fromNetwork.symbol == "TAN") {
      switchChainAsync(
        {
          chainId: TANConfig.chainId,
        },
        {
          onError: (err) =>
            toast.error(
              err.shortMessage || "Something went wrong while switching chain"
            ),
        }
      );
    } else {
      switchChainAsync(
        {
          chainId: networkList?.[1]?.chainId,
        },
        {
          onError: (err) =>
            toast.error(
              err.shortMessage || "Something went wrong while switching chain"
            ),
        }
      );
    }
  }, [formValue.fromNetwork]);

  const switchHandler = async () => {
    try {
      setFormValue((p) => {
        return {
          ...p,
          fromNetwork: p.toNetwork,
          toNetwork: p.fromNetwork,
          toToken: p.fromToken,
          fromToken: p.toToken,
        };
      });
      setBtnText((p) => {
        return "Transact" == p ? "Burn" : "Transact";
      });
    } catch (error) {
      console.log(error, "switchError");
    }
  };

  const isValid = useMemo(() => {
    if (!formValue.fromAmount) {
      return true;
    }
    if (Number(formValue.fromAmount ?? 0) > Number(fromTokenBalance ?? 0)) {
      return false;
    }
    return true;
  }, [formValue, fromTokenBalance]);

  const depositNativeOrWeth = async () => {
    setIsLoading(true);
    if (!isConnected) {
      console.log("Please connect your wallet.");
      return;
    }
    try {
      const contract = new ethers.Contract(
        DepositeEtherContractAddress,
        contractABI,
        etherSigner
      );
      const amountToDeposit = parseEther(formValue?.fromAmount?.toString());

      if (amountToDeposit > 0) {
        const transaction = {
          value: amountToDeposit,
        };
        setIsLoading(true);
        const txResponse = await contract.deposit(amountToDeposit, transaction);
        const receipt = await txResponse.wait();
      }
      setFormValue({ ...formValue, fromAmount: "" });
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast.error(error?.shortMessage || error?.message || "");
    }
  };

  const depositWrappedToken = async () => {
    try {
      setIsLoading(true);

      const contract = new ethers.Contract(
        DepositeEtherContractAddress,
        contractABI,
        etherSigner
      );
      const weth = new ethers.Contract(
        formValue?.from?.address,
        wethAbi,
        etherSigner
      );

      const amountInWei = parseUnits(formValue?.fromAmount.toString(), 18);
      const gasPrice = await getGasPrice(config);

      const gasLimit = 100000;

      const allowance = await weth.allowance(
        address,
        DepositeEtherContractAddress
      );
      const formattedAllowance = parseUnits(allowance.toString(), 18);

      if (formattedAllowance < amountInWei) {
        const approveTx = await weth.approve(
          DepositeEtherContractAddress,
          "10000000000000000000",
          {
            gasLimit,
            gasPrice,
          }
        );
        await approveTx.wait();
      }

      const depositTx = await contract.deposit(amountInWei);
      const depositReceipt = await depositTx.wait();

      toast.success("Transaction successfull");
      setFormValue({ ...formValue, fromAmount: "" });
    } catch (err) {
      console.error("Error sending transaction:", err);
      toast.error(err?.shortMessage || err?.message || "");
    }
  };

  const burnHandler = async () => {
    try {
      setIsLoading(true);
      const amountInWei = parseUnits(formValue?.fromAmount.toString(), 18);
      const hash = await writeContractAsync({
        abi: MinTokenContractABI,
        address: mintContractToken.address,
        functionName: "burnWETH",
        args: [amountInWei],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: hash,
      });
      toast.success("Burned successfully.");
      setIsLoading(false);
      setFormValue({ ...formValue, fromAmount: "" });
      setIsLoading(false);
    } catch (error) {
      console.log(error, "BurnfxnalityError");
      toast.error(error?.shortMessage || error?.message || "");
      setIsLoading(false);
    }
  };

  const submitHandler = async () => {
    try {
      if (formValue.fromAmount <= 0 || !isValid || isLoading) return;

      if (formValue?.fromNetwork?.symbol == "TAN") {
        burnHandler();
      } else {
        if (formValue?.from?.address) {
          depositWrappedToken();
        } else {
          depositNativeOrWeth();
        }
      }
    } catch (error) {
      console.log(error, "Submit Error");
    }
  };

  return (
    <div>
      <div className="w-full flex items-end justify-end">
        <BreadCrumb routes={breadCrumb} />
      </div>
      <div className="grid grid-cols-12 my-10">
        <div className="col-span-12 sm:col-span-12 lg:col-span-6 lg:col-start-4 xl:col-span-6 xl:col-start-4">
          <div className="col-span-12 md:col-span-6">
            <PageTitle
              title={"Bridge"}
              subtitle={
                "Seamlessly Transfer Tokens Between Different Blockchains Using the Bridge—Enable Cross-Chain Interoperability with Just a Few Clicks."
              }
            />
          </div>
          <div className="w-full border-2 border-stroke grid grid-cols-12 mt-4 rounded-2xl relative">
            {(toTokenBalanceLoading || fromTokenBalanceLoading) && (
              <span className="loading loading-spinner loading-xl absolute right-2 top-2"></span>
            )}

            <div className="col-span-12 md:col-start-2 md:col-span-10 p-4 flex flex-col gap-6 py-12">
              <div className="flex items-end justify-center gap-4 md:gap-10 ">
                <div className="w-full flex items-start justify-center flex-col">
                  <label className="text-description">From Network</label>
                  <div className="flex gap-2 border-2 border-stroke w-full rounded-md p-2 items-center">
                    <img
                      src={formValue?.fromNetwork?.image_url}
                      alt=""
                      className="h-5"
                    />
                    <p className="text-xs md:text-base">
                      {formValue?.fromNetwork?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-2 border-2 bg-stroke rounded-full cursor-pointer">
                  <IconArrowsExchange2 onClick={switchHandler} />
                </div>
                <div className="w-full flex items-start justify-center flex-col">
                  <label className="text-description">To Network</label>
                  <div className="flex gap-2 border-2 border-stroke w-full rounded-md p-2 items-center">
                    <img
                      src={formValue?.toNetwork?.image_url}
                      alt=""
                      className="h-5"
                    />
                    <p className="text-xs md:text-base">
                      {formValue?.toNetwork?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between w-full border-2 border-stroke p-6 rounded-xl flex-col md:flex-row gap-8 md:gap-0">
                <div className="flex flex-col gap-10 flex-1">
                  <div>
                    <input
                      type="text"
                      className="text-4xl w-full outline-0"
                      placeholder="0.00"
                      value={formValue.fromAmount}
                      onChange={(e) => {
                        setFormValue((p) => {
                          return {
                            ...p,
                            fromAmount: e.target.value,
                            toAmount: e.target.value,
                          };
                        });
                      }}
                    />
                    {!isValid && (
                      <p className="text-error text-xs  ">
                        Amount should be lower than balance
                      </p>
                    )}
                  </div>
                  <button
                    className="text-sm border border-stroke px-2 rounded btn bg-background h-6 font-medium w-14 invisible hidden md:flex"
                    onClick={() => {
                      setFormValue((p) => {
                        return {
                          ...p,
                          fromAmount: Number(fromTokenBalance ?? 0),
                        };
                      });
                    }}
                  >
                    Max
                  </button>
                </div>
                <div className="flex flex-col gap-4 md:gap-10 flex-1 justify-center items-end w-full md:w-auto">
                  {formValue.fromNetwork.symbol == "TAN" ? (
                    <div className="border border-stroke p-1.5 px-4 rounded-md bg-background outline-0 w-full md:w-52">
                      <p>WETH</p>
                    </div>
                  ) : (
                    <select
                      className="border border-stroke p-2 px-4 rounded-md bg-background outline-0 w-full md:w-52"
                      onChange={(e) => {
                        setFormValue({
                          ...formValue,
                          fromToken: JSON.parse(e?.target?.value),
                        });
                      }}
                    >
                      <option disabled={true}>Pick a token</option>
                      <option value={JSON.stringify(bridgeToken[0])}>
                        ETH
                      </option>
                      <option value={JSON.stringify(bridgeToken[1])}>
                        WETH
                      </option>
                    </select>
                  )}
                  <p className="text-description break-keep ">
                    Balance: {formatNice(fromTokenBalance ?? 0)}{" "}
                    {formValue?.fromToken?.symbol}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-2 border-stroke rounded-xl p-4">
                <div className="flex gap-2">
                  <img
                    src={mintContractToken.image_url}
                    alt=""
                    className="h-6 object-contain"
                  />
                  <p>{formatNice(Number(formValue.toAmount ?? 0.0))}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-description">
                    {" "}
                    {formatNice(toTokenBalance ?? 0)}{" "}
                    {formValue?.toToken?.symbol}
                  </p>
                  <IconWallet className="text-description" />
                </div>
              </div>
              <CustomButton
                isConnected={isConnected}
                className={"rounded-md py-6"}
                disabled={!isValid}
                isLoading={isLoading}
                clickHandler={submitHandler}
              >
                {btnText || ""}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bridge;

const csvData = [
  "0x48A61b597361B84F76D78f3aD60479162bfc808E,0.00056",
  "0x9217a95aE45D9b8b51d0743D7CdcB953e3745Ab4,13.45",
  "0x1b7fD977833E6e82CD844151a6703D52E6A4D728,1.049",
  "0x85BC8640f06CE97DF3bC63fc5FfF0a0dD7EeeDDD,1",
];
