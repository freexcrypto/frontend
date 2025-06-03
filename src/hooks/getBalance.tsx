"use client";

import {
  IDRX_CONTRACT_ABI,
  IDRX_CONTRACT_ADDRESS,
  IDRX_CONTRACT_ADDRESS_BASE,
} from "@/config/IdrxContract";
import { useAccount, useReadContract } from "wagmi";
import React from "react";
import { useBalance } from "wagmi";

const CHAIN_CONFIG: Record<number, { tokenContract: `0x${string}` }> = {
  4202: { tokenContract: IDRX_CONTRACT_ADDRESS as `0x${string}` },
  84532: { tokenContract: IDRX_CONTRACT_ADDRESS_BASE as `0x${string}` },
};

export default function useGetBalance() {
  const { address, chain } = useAccount();
  const [tokenContract, setTokenContract] = React.useState<`0x${string}`>();
  // Set contracts and explorer based on chain
  React.useEffect(() => {
    if (chain?.id && CHAIN_CONFIG[chain.id]) {
      setTokenContract(CHAIN_CONFIG[chain.id].tokenContract);
    } else {
      setTokenContract(undefined);
    }
  }, [chain]);

  const { data: balanceNative, refetch: refetchBalanceNative } = useBalance({
    address: address,
  });

  const {
    data: balanceIdrx,
    isLoading,
    refetch,
    error,
  } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: IDRX_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  React.useEffect(() => {
    refetch();
    refetchBalanceNative();
  }, [refetch, refetchBalanceNative]);

  return {
    balanceNative: Number(balanceNative?.formatted).toFixed(5),
    balanceIdrx,
    isLoading,
    error,
  };
}
