"use client";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { arbitrum, mainnet } from "viem/chains";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  cookieStorage,
  cookieToInitialState,
  createStorage,
  WagmiProvider,
} from "wagmi";

export const TANConfig = {
  rpc: "https://tan-testnetrpc2.tan.live/",
  explorerName: "TAN Scan",
  explorerUrl: "https://testnet.tanscan.com",
  iconUrl: "/assets/logo/onlyLogo.svg",
  chainId: 4443,
  chainName: "TAN Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Tarality Advance network",
    symbol: "TAN",
  },
  multicall3Address: "0x6E675135df5715D8aBaFB0A904429fb1fd009444",
};

export const appConfigurations = [
  {
    rpc: "https://tan-devnetrpc1.tan.live/",
    explorerName: "TAN Ledger",
    explorerUrl: "https://testnet.tanscan.com",
    iconUrl: "/assets/logo/onlyLogo.svg",
    chainId: 4442,
    chainName: "TAN Devnet",
    nativeCurrency: {
      decimals: 18,
      name: "Tarality Advance network",
      symbol: "TAN",
    },
    multicall3Address: "0xb821099Fb8d4DbD0e7e7Ff64A7DE3BE99503a2af", //latest
  },
];

export const appConfigurationsMainNet = [
  {
    rpc: "https://tan-testnetrpc2.tan.live/",
    explorerName: "TAN Scan",
    explorerUrl: "https://testnet.tanscan.com",
    iconUrl: "/assets/logo/onlyLogo.svg",
    chainId: 4443,
    chainName: "TAN Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Tarality Advance network",
      symbol: "TAN",
    },
    multicall3Address: "0x6E675135df5715D8aBaFB0A904429fb1fd009444",
  },

  {
    rpc: "https://ethereum-sepolia-rpc.publicnode.com",
    explorerName: "Etherscan",
    explorerUrl: "https://sepolia.etherscan.io/",
    chainId: 11155111,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "Ether",
      symbol: "ETH",
    },
    multicall3Address: "0xcA11bde05977b3631167028862bE2a173976CA11",
  },
];

export const ChainConfig = appConfigurationsMainNet.map((config) => ({
  id: config.chainId,
  name: config.chainName,
  network: config.chainName,
  iconUrl: config.iconUrl ? config.iconUrl : undefined, // Customize icon URL if needed
  // iconBackground: "#fff", // Customize the icon background color if needed
  nativeCurrency: config.nativeCurrency,
  rpcUrls: {
    public: { http: [config.rpc] },
    default: { http: [config.rpc] },
  },
  blockExplorers: {
    etherscan: {
      name: config.explorerName,
      url: config.explorerUrl,
    },
    default: {
      name: config.explorerName,
      url: config.explorerUrl,
    },
  },
  contracts: {
    multicall3: {
      address: config.multicall3Address,
      blockCreated: config.blockCreated,
    },
  },
}));

export const projectId =
  process.env.NEXT_PUBLIC_PROJECT_ID || "38f6cbdcf2b580899317454c1ff8a4d4";
export const networks = [...ChainConfig];
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

const metadata = {
  name: "next-reown-appkit",
  description: "next-reown-appkit",
  // url: "https://github.com/0xonerb/next-reown-appkit-ssr", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "dark",

  features: {
    analytics: true,
    email: false,
    socials: [],
    swaps: false,
    pay: false,
    send: false,
    walletFeaturesOrder: ["receive" | "onramp" | "swaps" | "send"],
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

const BlockChainWrapper = ({ children, cookies }) => {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      {children}
    </WagmiProvider>
  );
};

export default BlockChainWrapper;
