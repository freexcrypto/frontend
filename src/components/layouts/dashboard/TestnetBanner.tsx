"use client";
import { StickyBanner } from "@/components/ui/sticky-banner";
import React from "react";
import { liskSepolia, baseSepolia } from "viem/chains";
import { useAccount } from "wagmi";

export default function TestnetBanner() {
  const { chain } = useAccount();

  if (chain?.id !== liskSepolia.id && chain?.id !== baseSepolia.id) {
    return null;
  }

  return (
    <StickyBanner
      className="bg-gradient-to-b from-blue-500 to-blue-600"
      hideOnScroll={true}
    >
      <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
        You are currently in testnet mode using the {chain.name} Network. All
        transactions and operations are for testing purposes only.
      </p>
    </StickyBanner>
  );
}
