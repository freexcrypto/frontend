"use client";
import { useAccount, useReadContract } from "wagmi";
import React from "react";
import { useBalance } from "wagmi";
import { useGetReceiveToken } from "./getRecieveToken";
import { USDC_ABI } from "@/config/UsdcContract";

export default function useGetBalance() {
  const { address } = useAccount();
  const { receiveToken } = useGetReceiveToken();

  const { data: balanceNative, refetch: refetchBalanceNative } = useBalance({
    address: address,
  });

  const {
    data: balanceUSDC,
    isLoading,
    refetch,
    error,
  } = useReadContract({
    address: receiveToken?.address as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  React.useEffect(() => {
    refetch();
    refetchBalanceNative();
  }, [refetch, refetchBalanceNative]);

  return {
    balanceNative: Number(balanceNative?.formatted).toFixed(5),
    balanceUSDC,
    decimalsUSDC: receiveToken?.decimals,
    isLoading,
    error,
  };
}
