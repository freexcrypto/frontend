"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccount } from "wagmi";
import Image from "next/image";
import { TokensType } from "@/hooks/getTokens";
import { TestnetTokenType } from "@/hooks/getTestnetTokens";

export default function TokensList({
  tokens,
  testnetTokens,
  selectedToken,
  setSelectedToken,
}: {
  tokens: TokensType[];
  testnetTokens: TestnetTokenType[];
  selectedToken: TokensType;
  setSelectedToken: (token: TokensType) => void;
}) {
  const { chain } = useAccount();

  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="border w-full p-3 rounded-md shadow cursor-pointer hover:bg-secondary duration-300">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <Image
                src={
                  selectedToken.logoURI ||
                  "https://www.ledr.com/colours/white.jpg"
                }
                alt={selectedToken.symbol}
                width={35}
                height={35}
                className="rounded-full"
              />
              <div>
                <p>{selectedToken.symbol}</p>
                <p className="text-muted-foreground text-sm">
                  {selectedToken.address.slice(0, 6)}...
                  {selectedToken.address.slice(-4)}
                </p>
              </div>
            </div>
          ) : (
            "Select Token"
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List Token in {chain?.name} Network</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-4">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="flex items-center justify-between border p-3 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedToken(token);
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={
                    token.logoURI || "https://www.ledr.com/colours/white.jpg"
                  }
                  alt={token.symbol}
                  width={40}
                  height={40}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-gray-500">{token.symbol}</p>
                  <p>
                    {token.address.slice(0, 5)}...{token.address.slice(-4)}
                  </p>
                </div>
              </div>
              <p className="text-right text-sm text-gray-600">
                ${parseFloat(token.priceUSD).toFixed(2)}
              </p>
            </div>
          ))}
          {testnetTokens.map((token: TestnetTokenType) => (
            <div
              key={token.address}
              className="flex items-center justify-between border p-3 rounded-md hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedToken({
                  ...token,
                  symbol: token.symbol ?? "",
                  logoURI: token.logoURI ?? "",
                  priceUSD: token.priceUSD ?? "0",
                  address: token.address ?? "",
                  name: token.name ?? "",
                  decimals: token.decimals ?? 18,
                });
                setOpen(false);
              }}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={token.logoURI ?? ""}
                  alt={token.symbol ?? ""}
                  width={40}
                  height={40}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <p className="font-medium">{token.name ?? ""}</p>
                  <p className="text-sm text-gray-500">{token.symbol ?? ""}</p>
                  <p>
                    {(token.address ?? "").slice(0, 5)}...
                    {(token.address ?? "").slice(-4)}
                  </p>
                </div>
              </div>
              <p className="text-right text-sm text-gray-600">
                ${parseFloat(token.priceUSD ?? "0").toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
