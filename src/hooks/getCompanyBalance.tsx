"use client";

import {
  IDRX_CONTRACT_ABI,
  IDRX_CONTRACT_ADDRESS,
} from "@/config/IdrxContract";
import { useReadContract } from "wagmi";

export default function useGetCompanyBalance(business_id: string | undefined) {
  const { data: balanceIdrx } = useReadContract({
    address: IDRX_CONTRACT_ADDRESS,
    abi: IDRX_CONTRACT_ABI,
    functionName: "balanceOf",
    args: [business_id],
  });
  return { balanceIdrx };
}
