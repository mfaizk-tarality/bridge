import { BrowserProvider, JsonRpcSigner } from "ethers";
import { useMemo } from "react";
import { useConnectorClient } from "wagmi";

/**
 * Converts a viem Wallet Client to an ethers.js Signer.
 * @param {Object} client - The viem wallet client.
 * @returns {JsonRpcSigner} The ethers.js signer.
 */
function clientToSigner(client) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/**
 * Custom hook to convert a viem Wallet Client to an ethers.js Signer.
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.chainId] - The chain ID.
 * @returns {JsonRpcSigner|undefined} The ethers.js signer or undefined.
 */
export function useEthersSigner({ chainId } = {}) {
  const { data: client } = useConnectorClient({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}
