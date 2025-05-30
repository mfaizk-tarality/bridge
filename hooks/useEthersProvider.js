import { FallbackProvider, JsonRpcProvider } from "ethers";
import { useMemo } from "react";
import { useClient } from "wagmi";

/**
 * Converts a viem Client to an ethers.js Provider.
 * @param {Object} client - The viem client.
 * @returns {JsonRpcProvider|FallbackProvider} The ethers.js provider.
 */
function clientToProvider(client) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  if (transport.type === "fallback") {
    const providers = transport.transports.map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new FallbackProvider(providers);
  }

  return new JsonRpcProvider(transport.url, network);
}

/**
 * Custom hook to convert a viem Client to an ethers.js Provider.
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.chainId] - The chain ID.
 * @returns {JsonRpcProvider|FallbackProvider|undefined} The ethers.js provider or undefined.
 */
export function useEthersProvider({ chainId } = {}) {
  const client = useClient({ chainId });
  return useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  );
}
