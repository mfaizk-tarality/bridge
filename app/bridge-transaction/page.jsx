"use client";
import BreadCrumb from "@/common_component/BreadCrumb";
import CustomButton from "@/common_component/CustomButton";
import PageTitle from "@/common_component/PageTitle";
import { maskValue, sortAddress, useAddToken } from "@/utils";
import { formatNice } from "coin-format";
import { useAccount, useConfig } from "wagmi";
import moment from "moment";
import { IconCheck, IconSearch, IconX } from "@tabler/icons-react";
import LoadingScreen from "@/common_component/LoadingScreen";
import { useState } from "react";
import NoDataFound from "@/common_component/NoDataFound";
import { useBridgeHistory } from "@/modules/bridge";
const breadCrumb = [
  {
    text: "Home",
    href: "/home",
  },
  {
    text: "Bridge Transactions",
    href: "/bridge-transaction",
  },
];

const BridgeTransaction = () => {
  const { address, isConnected } = useAccount();
  const [search, setSearch] = useState("");
  const { data: bridgeHistory, isLoading: bridgeHistoryLoading } =
    useBridgeHistory({ address });

  console.log(bridgeHistory, "bridgeHistory");

  return (
    <div className="">
      <div className="w-full flex items-end justify-end">
        <BreadCrumb routes={breadCrumb} />
      </div>

      <div className="grid grid-cols-12">
        <div className="md:col-start-2 md:col-span-10 col-span-12 ">
          <div className="col-span-12 grid-cols-12 grid  my-10">
            <div className="col-span-12">
              <PageTitle
                title={"Bridge Transactions"}
                subtitle={
                  "Seamlessly Transfer Tokens Between Different Blockchains Using the Bridge—Enable Cross-Chain Interoperability with Just a Few Clicks."
                }
              />
            </div>
          </div>

          <div className="max-h-[700px] overflow-auto w-full">
            {bridgeHistoryLoading && (
              <LoadingScreen
                className={"min-h-[400px]"}
                text={"Getting Transactions..."}
              />
            )}
            {!bridgeHistoryLoading && bridgeHistory?.length == 0 && (
              <div className="min-h-56">
                <NoDataFound text={"No Data Found."} />
              </div>
            )}
            {!bridgeHistoryLoading && bridgeHistory?.length != 0 && (
              <table className="table table-md table-pin-rows table-pin-cols flex-1 min-w-[800px]">
                <thead>
                  <tr className="bg-stroke">
                    <td>Transaction Hash</td>
                    <td>Amount</td>
                    <td>From Network</td>
                    <td>To Network</td>
                    <td>Date/Time</td>
                    <td>Status</td>
                  </tr>
                </thead>
                <tbody>
                  {bridgeHistory?.map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td>
                          {maskValue({
                            str: item?.transactionHash,
                            enableCopyButton: true,
                          })}
                        </td>
                        <td>{formatNice(item?.amount ?? 0)}</td>
                        <td>TAN Devnet</td>
                        <td>Ethereum</td>
                        <td>
                          {item?.createdAt
                            ? moment(item?.createdAt)?.format("lll")
                            : ""}
                        </td>
                        <td>
                          <p
                            className={` font-semibold ${
                              item?.approvedBy?.length <= 0
                                ? "text-yellow-500"
                                : "text-[#25E232]"
                            }`}
                          >
                            {item?.approvedBy?.length == 0 && "Pending"}
                            {item?.approvedBy?.length == 1 &&
                              "Partially Approved"}
                            {item?.approvedBy?.length == 2 && "Approved"}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BridgeTransaction;
