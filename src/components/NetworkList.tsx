import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAccount, useSwitchChain } from "wagmi";

export default function NetworkList() {
  const { chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  return (
    <Select onValueChange={(value) => switchChain({ chainId: Number(value) })}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={chain?.name || "Select Network"} />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={String(chain.id)}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
