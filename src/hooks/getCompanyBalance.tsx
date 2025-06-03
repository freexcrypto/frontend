"use client";

import {
  USDC_ABI,
  USDC_TOKEN_ADDRESS_BASE_SEPOLIA,
} from "@/config/UsdcContract";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

const CHAIN_CONFIG: Record<number, { tokenContract: `0x${string}` }> = {
  // 4202: { tokenContract: IDRX_CONTRACT_ADDRESS as `0x${string}` },
  84532: { tokenContract: USDC_TOKEN_ADDRESS_BASE_SEPOLIA as `0x${string}` },
};

export default function useGetCompanyBalance(business_id: string | undefined) {
  const { chain } = useAccount();
  const [tokenContract, setTokenContract] = React.useState<`0x${string}`>();
  // Set contracts and explorer based on chain
  React.useEffect(() => {
    if (chain?.id && CHAIN_CONFIG[chain.id]) {
      setTokenContract(CHAIN_CONFIG[chain.id].tokenContract);
    } else {
      setTokenContract(undefined);
    }
  }, [chain]);

  const { data: balanceUSDC } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: [business_id],
  });
  return { balanceUSDC };
}
