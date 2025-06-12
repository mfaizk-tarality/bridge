"use client";
import CustomButton from "@/common_component/CustomButton";
import CustomDivider from "@/common_component/CustomDivider";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import {
  IconArrowBadgeDownFilled,
  IconBrandSlack,
  IconComponents,
  IconFlame,
  IconHomeEco,
  IconMessageCheck,
  IconSearch,
  IconTaxPound,
  IconZoomReplace,
} from "@tabler/icons-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const Home = () => {
  const [search, setSearch] = useState("");
  const dappData = useDappData(search);

  return (
    <div className="grid grid-cols-12 w-full m-2 md:m-0 ">
      <div className="col-span-12 md:col-span-6 flex flex-col items-start justify-center gap-6 min-h-96">
        <h4 className="text-3xl md:text-5xl font-semibold">
          An EVM compatible L-1 chain powered by BPos consensus
        </h4>
        <p className="text-description text-base">
          TAN is the native cryptocurrency of TAN, offering scalability, low
          fees, and strong security. With a capped supply of 30 billion, TAN
          powers payments, staking, and ecosystem rewards.
        </p>
        <CustomButton>View More</CustomButton>
      </div>
      <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end items-center min-h-96">
        <img src="/assets/brand/coin.svg" alt="" className="md:h-80" />
      </div>
      <div className="col-span-12 hidden md:flex justify-center items-center ">
        <CustomDivider className="my-20 w-full border-b-2" />
      </div>
      <div className="col-span-12 flex gap-2 flex-row items-center justify-between">
        <div className="flex gap-2 flex-col">
          <h4 className="text-3xl font-semibold">Featured Apps</h4>
          <p className="text-description">
            Explore popular apps within the ecosystem
          </p>
        </div>
        <div>
          <label className="input bg-background border rounded-4xl ">
            <IconSearch />
            <input
              type="search"
              className="grow outline-0 border-0"
              placeholder="Search Apps"
              onChange={(e) => setSearch(e?.target?.value)}
            />
          </label>
        </div>
      </div>
      <div className="col-span-12 grid grid-cols-12 gap-8 my-10">
        {dappData?.map((item, idx) => {
          return (
            <div
              className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 cursor-pointer"
              key={idx}
            >
              <CardContainer className="">
                <CardBody className="relative group/card  dark:hover:shadow-2xl dark:hover:shadow-tanborder/[0.1]  border border-stroke w-auto h-auto rounded-xl  ">
                  <CardItem
                    translateZ="50"
                    key={idx}
                    className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3   min-h-96 flex items-center justify-evenly flex-col p-10 text-center rounded-2xl"
                  >
                    <item.icon size={40} />
                    <h4>{item?.label}</h4>
                    <p>{item?.desc}</p>
                    <Link href={item.href || "#"}>
                      <CustomButton className={"rounded-sm min-w-40"}>
                        {item?.btnText}
                      </CustomButton>
                    </Link>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;

const useDappData = (search) => {
  return useMemo(() => {
    return [
      {
        label: "Faucet",
        desc: "Easily request free testnet tokens to kickstart your development and testing instantly.",
        icon: IconTaxPound,
        btnText: "Claim TAN",
        href: "/faucet",
      },
      {
        label: "Token Creator",
        desc: "Deploy custom tokens easily—mint, burn, reflect, and more with no coding required.",
        icon: IconComponents,
        btnText: "Create Token",
        href: "/token-creator",
      },
      {
        label: "Multisender",
        desc: "Distribute tokens instantly to many addresses—save time and gas with Multisender.",
        icon: IconBrandSlack,
        btnText: "Send Token",
        href: "/multisender",
      },
      {
        label: "Bridge",
        desc: "Transfer tokens across blockchains—enable cross-chain interoperability in a few clicks.",
        icon: IconArrowBadgeDownFilled,
        btnText: "Transact",
      },
      {
        label: "Validator Pool",
        desc: "Stake Tokens in the Validator Pool to Support Decentralization and Consensus.",
        icon: IconMessageCheck,
        btnText: "Stake",
      },
      {
        label: "Burn Subsidy",
        desc: "Burn Tokens Strategically While Managing Vesting Through the Burn Subsidy Mechanism.",
        icon: IconFlame,
        btnText: "Burn",
      },
      {
        label: "Ecosystem Subsidy",
        desc: "Earn rewards, stake with purpose, and grow with TAN every transaction drives your success in our ecosystem!",
        icon: IconHomeEco,
        btnText: "Earn More Rewards",
      },
      {
        label: "Swap",
        desc: "Use the Built-In Swap Tool for Fast, Secure, and Gas-Efficient Token Conversions Across Supported Pairs.",
        icon: IconZoomReplace,
        btnText: "Swap",
      },
    ].filter((item) => {
      if (search) {
        if (item.label.toLowerCase()?.includes(String(search)?.toLowerCase())) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    });
  }, [search]);
};
