"use client";

import {
  IDRX_CONTRACT_ABI,
  IDRX_CONTRACT_ADDRESS,
} from "@/config/IdrxContract";
import { useAccount, useReadContract } from "wagmi";

export default function useGetBalance() {
  const { address } = useAccount();
  const { data: balanceIdrx } = useReadContract({
    address: IDRX_CONTRACT_ADDRESS,
    abi: IDRX_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return { balanceIdrx };
}
