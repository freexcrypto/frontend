"use client";

import { Button } from "./ui/button";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { useConnect } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { config } from "@/config/Web3Provider";
import useGetBalance from "@/hooks/getBalance";
import { Wallet } from "lucide-react";
import { formatUnits } from "viem";
import React from "react";

export const ConnectButtonCustom = () => {
  const { address, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { balanceNative, balanceIdrx } = useGetBalance();

  const [selectedChain, setSelectedChain] = React.useState<number | null>();

  React.useEffect(() => {
    setSelectedChain(chain?.id);
  }, [chain?.id]);

  const { chains, switchChain } = useSwitchChain({
    config: config,
  });

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>{chain?.name}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Switch Chain</DialogTitle>
              </DialogHeader>
              <div className="grid gap-2">
                {chains.map((chain) => (
                  <div
                    key={chain.id}
                    onClick={() => switchChain({ chainId: chain.id })}
                    className={`text-start p-3 rounded-md cursor-pointer  ${
                      selectedChain === chain.id
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {chain.name}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Chain/Network</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {chains.map((chain) => (
                      <DropdownMenuItem key={chain.id}>
                        {chain.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => disconnect()}>
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Wallet />
                <p>
                  {balanceNative} {chain?.nativeCurrency.symbol}
                </p>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Balance Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {balanceIdrx ? formatUnits(balanceIdrx as bigint, 2) : 0}{" "}
                <strong>IDRX</strong>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect to your wallet</DialogTitle>
              <DialogDescription>
                Choose your preferred wallet to connect to the application
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {connectors.map((connector) => (
                <div
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="flex items-center justify-start gap-2 w-full border p-3 rounded-md hover:bg-accent cursor-pointer duration-300"
                >
                  <img
                    src={connector.icon}
                    alt={connector.name}
                    width={35}
                    height={35}
                  />
                  <p className="font-medium"> {connector.name}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
