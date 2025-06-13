"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { config } from "@/config/Web3Provider";
import { useGetReceiveToken } from "@/hooks/getRecieveToken";
import useGetCompanyBalance from "@/hooks/getCompanyBalance";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import { parseUnits, formatUnits } from "viem";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SwitchCamera, Wallet } from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetQuote from "@/hooks/getQuote";

interface FeeCost {
  name: string;
  amount: string;
  token: {
    symbol: string;
  };
  amountUSD?: string;
}

interface GasCost {
  type: string;
  amount: string;
  token: {
    symbol: string;
    decimals: number;
  };
  amountUSD?: string;
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  isBold?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isBold = false }) => (
  <div className="flex items-center justify-between">
    <Label className={isBold ? "font-bold" : "text-muted-foreground"}>
      {label}
    </Label>
    <p className={isBold ? "font-bold" : ""}>{value}</p>
  </div>
);

export default function Rebalancing() {
  const { address, chain } = useAccount();
  const { chains } = config;
  const { receiveToken } = useGetReceiveToken();
  const { business } = useGetBusinessByUser();
  const { balanceUSDC, decimalsUSDC } = useGetCompanyBalance(
    business?.address_wallet
  );

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>(
    balanceUSDC ? formatUnits(balanceUSDC as bigint, Number(decimalsUSDC)) : "1"
  );
  const [isSending, setIsSending] = useState(false);
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState<number>(42161); // Default to Arbitrum

  const sourceChain = chain ? chains.find((c) => c.id === chain.id) : null;
  const destinationChain = chains.find(
    (c) => c.id === selectedDestinationChain
  );
  const availableChains = chains.filter((c) => c.id !== chain?.id);

  const {
    quote,
    loading: isLoadingQuote,
    error: isErrorQuote,
  } = useGetQuote({
    fromChain: String(chain?.id),
    toChain: String(selectedDestinationChain),
    fromToken: receiveToken?.address ?? "",
    toToken: receiveToken?.address ?? "",
    fromAddress: address as `0x${string}`,
    toAddress: business?.address_wallet ?? "",
    toAmount: amount
      ? parseUnits(amount, Number(decimalsUSDC)).toString()
      : "0",
  });

  const handleExecute = async () => {
    if (
      !receiveToken?.address ||
      !address ||
      !business?.address_wallet ||
      !sourceChain ||
      !destinationChain
    )
      return;
    setIsSending(true);

    try {
      const amountInWei = parseUnits(amount, Number(decimalsUSDC));
      // TODO: Implement your cross-chain transfer logic here
      toast.success("Transfer completed successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error("Transfer failed:", error);
      toast.error(error.message ?? "Transfer failed");
    } finally {
      setIsSending(false);
    }
  };

  const insufficientBalance =
    Number(amount) >
    Number(formatUnits((balanceUSDC as bigint) ?? "0", Number(decimalsUSDC)));

  if (!sourceChain) {
    return (
      <section>
        <h2 className="text-xl font-semibold">
          Rebalancing Company USDC Balance
        </h2>
        <p className="text-muted-foreground">
          Please connect to a supported chain
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold">
        Rebalancing Company USDC Balance
      </h2>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <SwitchCamera className="mr-2" /> Rebalance
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rebalance Payment Balance</DialogTitle>
            <DialogDescription>
              Transfer USDC between chains. Review and confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>
                From: <strong>{sourceChain.name}</strong>
              </span>
              <select
                value={selectedDestinationChain}
                onChange={(e) =>
                  setSelectedDestinationChain(Number(e.target.value))
                }
                className="border rounded px-2 py-1"
                disabled={isSending}
              >
                {availableChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="flex items-center gap-1">
                  <Wallet strokeWidth={1} />
                  <strong>
                    {formatUnits(
                      (balanceUSDC as bigint) ?? "0",
                      Number(decimalsUSDC)
                    )}
                  </strong>
                  <Avatar className="size-6">
                    <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
                    <AvatarFallback>USDC</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex items-center gap-2 relative">
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="0.1"
                  disabled={isSending}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAmount(
                      formatUnits(
                        (balanceUSDC as bigint) ?? "0",
                        Number(decimalsUSDC)
                      )
                    )
                  }
                  disabled={isSending}
                  className="absolute right-12"
                >
                  Max
                </Button>
                <Avatar className="absolute right-0">
                  <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
                  <AvatarFallback>USDC</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {!isLoadingQuote && !isErrorQuote && quote && (
              <section className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <InfoRow
                  label="Provider"
                  value={
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src={quote.toolDetails.logoURI} />
                        <AvatarFallback>
                          {quote.toolDetails?.name?.[0] ?? quote.tool[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>{quote.toolDetails?.name ?? quote.tool}</span>
                    </div>
                  }
                />

                {(quote.estimate.fromAmountUSD ||
                  quote.estimate.toAmountUSD) && (
                  <InfoRow
                    label="Estimated USD Value"
                    value={`$${quote.estimate.fromAmountUSD ?? "0"} → $${
                      quote.estimate.toAmountUSD ?? "0"
                    }`}
                  />
                )}

                {quote.estimate.feeCosts?.map((fee: FeeCost, i: number) => (
                  <InfoRow
                    key={`fee-${i}`}
                    label={fee.name}
                    value={`${fee.amount} ${fee.token.symbol}${
                      fee.amountUSD ? ` ($${fee.amountUSD})` : ""
                    }`}
                  />
                ))}

                {quote.estimate.gasCosts?.map((gas: GasCost, i: number) => (
                  <InfoRow
                    key={`gas-${i}`}
                    label={`Gas (${gas.type})`}
                    value={`${formatUnits(
                      BigInt(gas.amount),
                      Number(gas.token.decimals)
                    )} ${gas.token.symbol}${
                      gas.amountUSD ? ` ($${gas.amountUSD})` : ""
                    }`}
                  />
                ))}

                <InfoRow
                  label="Estimated Duration"
                  value={`${quote.estimate.executionDuration} sec`}
                />

                <InfoRow
                  label="Total Amount Payment"
                  value={`${amount} USDC`}
                  isBold
                />
              </section>
            )}

            <Button
              onClick={handleExecute}
              disabled={isSending || insufficientBalance}
              className="w-full"
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : (
                "Execute Transfer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
