"use client";

import {
  IDRX_CONTRACT_ABI,
  IDRX_CONTRACT_ADDRESS,
  IDRX_CONTRACT_ADDRESS_BASE,
} from "@/config/IdrxContract";
import React from "react";
import { useAccount, useReadContract } from "wagmi";

const CHAIN_CONFIG: Record<number, { tokenContract: `0x${string}` }> = {
  4202: { tokenContract: IDRX_CONTRACT_ADDRESS as `0x${string}` },
  84532: { tokenContract: IDRX_CONTRACT_ADDRESS_BASE as `0x${string}` },
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

  const { data: balanceIdrx } = useReadContract({
    address: tokenContract as `0x${string}`,
    abi: IDRX_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [business_id],
  });
  return { balanceIdrx };
}
