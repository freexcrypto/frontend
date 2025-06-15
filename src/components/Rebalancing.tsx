"use client";
import React, { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { config } from "@/config/Web3Provider";
import { useGetReceiveToken, TOKEN_MAP } from "@/hooks/getRecieveToken";
import useGetCompanyBalance from "@/hooks/getCompanyBalance";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import { parseUnits, formatUnits } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "viem/actions";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SwitchCamera,
  Wallet,
  CheckCircle2,
  ExternalLink,
  Clock,
  Loader2,
  Link2,
} from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetQuote from "@/hooks/getQuote";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";

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

const ERC20_ABI = [
  {
    name: "approve",
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    name: "allowance",
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function Rebalancing() {
  const { address, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chains } = config;
  const { receiveToken } = useGetReceiveToken();
  const { business } = useGetBusinessByUser();
  const { balanceUSDC, decimalsUSDC } = useGetCompanyBalance(
    business?.address_wallet
  );

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<string>(
    balanceUSDC && decimalsUSDC
      ? formatUnits(balanceUSDC as bigint, Number(decimalsUSDC))
      : "0"
  );
  const [isSending, setIsSending] = useState(false);
  const [selectedDestinationChain, setSelectedDestinationChain] =
    useState<number>(42161);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(0);

  const [debouncedAmount] = useDebounce(amount, 500);

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
    toToken: TOKEN_MAP[selectedDestinationChain]?.address ?? "",
    fromAddress: address as `0x${string}`,
    toAddress: business?.address_wallet ?? "",
    toAmount:
      debouncedAmount && decimalsUSDC
        ? parseUnits(debouncedAmount, Number(decimalsUSDC)).toString()
        : "0",
  });

  // Update UI: tambahkan indikator loading debounce (opsional)
  const [isTyping, setIsTyping] = useState(false);
  React.useEffect(() => {
    if (amount !== debouncedAmount) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [amount, debouncedAmount]);

  // Update amount when balanceUSDC changes
  React.useEffect(() => {
    if (balanceUSDC && decimalsUSDC) {
      setAmount(formatUnits(balanceUSDC as bigint, Number(decimalsUSDC)));
    }
  }, [balanceUSDC, decimalsUSDC]);

  async function checkAndSetAllowance(
    tokenAddress: string,
    approvalAddress: string,
    amount: bigint
  ) {
    if (!walletClient || !address) return;

    try {
      const erc20Contract = {
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
      };

      const allowance = await readContract(walletClient, {
        ...erc20Contract,
        functionName: "allowance",
        args: [address, approvalAddress as `0x${string}`],
      });

      if (BigInt(allowance) < amount) {
        const approveTx = await writeContract(walletClient, {
          ...erc20Contract,
          functionName: "approve",
          args: [approvalAddress as `0x${string}`, amount],
        });

        toast.info("Approving token spend...");
        await waitForTransactionReceipt(walletClient, { hash: approveTx });
        toast.success("Token approval successful!");
      }
    } catch (error) {
      console.error("Error in allowance check/set:", error);
      toast.error("Failed to approve token spend");
      throw error;
    }
  }

  const startCountdown = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="text-green-500 size-8" />
          <h2 className="text-xl font-semibold">Rebalance Successful!</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600 mb-1">Transaction Hash</div>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-gray-100 p-1 rounded flex-1">
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </code>
              <a
                href={`${chain?.blockExplorers?.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600 mb-1">Rebalance Details</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-medium">{amount} USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>From:</span>
                <span className="font-medium">{sourceChain?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>To:</span>
                <span className="font-medium">{destinationChain?.name}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="size-4" />
            <span>Page will refresh in {countdown} seconds...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleExecute = async () => {
    if (
      !receiveToken?.address ||
      !address ||
      !business?.address_wallet ||
      !sourceChain ||
      !destinationChain ||
      !quote?.transactionRequest
    )
      return;
    setIsSending(true);

    try {
      // Check and set allowance if needed
      if (receiveToken?.address && quote.estimate?.approvalAddress) {
        await checkAndSetAllowance(
          receiveToken.address,
          quote.estimate.approvalAddress,
          BigInt(quote.estimate.fromAmount)
        );
      }

      const txHash = await walletClient?.sendTransaction({
        to: quote.transactionRequest.to as `0x${string}`,
        data: quote.transactionRequest.data as `0x${string}`,
        value: BigInt(quote.transactionRequest.value || "0"),
        gas: BigInt(quote.transactionRequest.gasPrice || "0"),
      });

      if (!txHash) throw new Error("Transaction failed");

      setTxHash(txHash);
      setShowSuccessModal(true);
      toast.success("Rebalance transaction sent!");
      startCountdown();
    } catch (error: any) {
      console.error("Rebalance failed:", error);
      toast.error(error.message ?? "Rebalance failed");
    } finally {
      setIsSending(false);
    }
  };

  const insufficientBalance =
    Number(amount) >
    Number(formatUnits((balanceUSDC as bigint) ?? "0", Number(decimalsUSDC)));

  if (!sourceChain) {
    return (
      <section className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          Rebalancing Company USDC Balance
        </h2>
        <p className="text-muted-foreground">
          Please connect to a supported chain
        </p>
      </section>
    );
  }

  return (
    <section className="border rounded-md p-5 space-y-5">
      <Link2 strokeWidth={2} size={30} />
      <h2 className="text-lg font-bold">Rebalancing Company</h2>

      <p className="text-sm text-muted-foreground">
        Reallocate the company's USDC balance from other networks following a
        users payment.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto">
            <SwitchCamera className="mr-2" /> Rebalance
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rebalance Payment Balance</DialogTitle>
            <DialogDescription>
              Rebalance USDC Company Balance from other network after user make
              payment.
            </DialogDescription>
          </DialogHeader>

          {showSuccessModal && <SuccessModal />}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>
                From: <strong>{sourceChain.name}</strong>
              </span>
              <Select
                value={String(selectedDestinationChain)}
                onValueChange={(value) =>
                  setSelectedDestinationChain(Number(value))
                }
              >
                <SelectTrigger
                  className="w-[180px]"
                  disabled={isSending || isLoadingQuote}
                >
                  <SelectValue placeholder="Select Network" />
                </SelectTrigger>
                <SelectContent>
                  {availableChains.map((chain) => (
                    <SelectItem key={chain.id} value={String(chain.id)}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  type="number"
                  min="0"
                  step="0.1"
                  disabled={isSending || isLoadingQuote}
                />
                {isTyping && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                  </div>
                )}
                <Avatar className="absolute right-0">
                  <AvatarImage src="https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png" />
                  <AvatarFallback>USDC</AvatarFallback>
                </Avatar>
              </div>
            </div>

            {isLoadingQuote ? (
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Calculating quote...</span>
                </div>
              </div>
            ) : isErrorQuote ? (
              <div className="space-y-2 bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <span>Error: {isErrorQuote}</span>
                </div>
              </div>
            ) : quote ? (
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
            ) : null}

            <Button
              onClick={handleExecute}
              disabled={
                isSending ||
                insufficientBalance ||
                !quote?.transactionRequest ||
                isLoadingQuote
              }
              className="w-full"
            >
              {isSending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isLoadingQuote ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Calculating...
                </div>
              ) : insufficientBalance ? (
                "Insufficient Balance"
              ) : (
                "Execute Rebalance"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
