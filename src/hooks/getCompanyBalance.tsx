"use client";

import { USDC_ABI } from "@/config/UsdcContract";
import { useReadContract } from "wagmi";
import { useGetReceiveToken } from "./getRecieveToken";

export default function useGetCompanyBalance(business_id: string | undefined) {
  const { receiveToken } = useGetReceiveToken();

  const { data: balanceUSDC } = useReadContract({
    address: receiveToken?.address as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [business_id as `0x${string}`],
  });

  return { balanceUSDC, decimalsUSDC: receiveToken?.decimals };
}
