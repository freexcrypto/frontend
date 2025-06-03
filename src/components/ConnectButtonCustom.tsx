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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { config } from "@/config/Web3Provider";
import useGetBalance from "@/hooks/getBalance";
import { EarthLock, User, Wallet } from "lucide-react";
import React from "react";
import { baseSepolia } from "viem/chains";
import { formatUnits } from "viem";

export const ConnectButtonCustom = () => {
  const { address, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { balanceNative, balanceUSDC } = useGetBalance();

  const [selectedChain, setSelectedChain] = React.useState<number | undefined>(
    baseSepolia.id
  );

  React.useEffect(() => {
    setSelectedChain(chain?.id);
  }, [chain?.id]);

  const { chains, switchChain } = useSwitchChain({
    config: config,
  });

  React.useEffect(() => {
    if (!chain?.id) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [chain]);

  return (
    <div>
      {address ? (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <EarthLock />
                {chain?.name}
              </Button>
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
                <User /> {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                {balanceUSDC ? formatUnits(balanceUSDC as bigint, 18) : "0"}
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
                    src={
                      connector.icon ||
                      "https://cdn-icons-png.freepik.com/512/116/116369.png"
                    }
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
