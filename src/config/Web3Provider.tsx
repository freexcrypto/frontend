"use client";
import React from "react";
import { Config, http, createConfig, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask } from "wagmi/connectors";
import {
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  avalanche,
  base,
} from "viem/chains";

export const config = createConfig({
  ssr: true, // Make sure to enable this for server-side rendering (SSR) applications.
  chains: [sepolia, baseSepolia, arbitrumSepolia, avalanche, base],
  connectors: [metaMask()],
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
  },
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
