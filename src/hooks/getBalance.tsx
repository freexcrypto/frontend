"use client";
import { useAccount, useReadContract } from "wagmi";
import React from "react";
import { useBalance } from "wagmi";
import {
  USDC_ABI,
  USDC_TOKEN_ADDRESS_BASE_SEPOLIA,
} from "@/config/UsdcContract";
import BalanceUser from "@/components/layouts/dashboard/home/BalanceUser";
import { formatUnits } from "viem";

const CHAIN_CONFIG: Record<number, { tokenContract: `0x${string}` }> = {
  // 4202: { tokenContract: IDRX_CONTRACT_ADDRESS as `0x${string}` },
  84532: { tokenContract: USDC_TOKEN_ADDRESS_BASE_SEPOLIA as `0x${string}` },
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
    data: balanceUSDC,
    isLoading,
    refetch,
    error,
  } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  React.useEffect(() => {
    refetch();
    refetchBalanceNative();
  }, [refetch, refetchBalanceNative]);

  return {
    balanceNative: Number(balanceNative?.formatted).toFixed(5),
    balanceUSDC,
    isLoading,
    error,
  };
}
