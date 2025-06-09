"use client";
import React from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import NetworkList from "@/components/NetworkList";
import TokensList from "@/components/TokensList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetTokens, { TokensType } from "@/hooks/getTokens";
import { useGetTestnetTokens } from "@/hooks/getTestnetTokens";
import TokenCalculate from "./TokenCalculate";
import useGetPaymentLink from "@/hooks/getPaymentLink";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";
import { useGetReceiveToken } from "@/hooks/getRecieveToken";
import useGetQuote from "@/hooks/getQuote";
import { BaseError, erc20Abi, formatUnits, parseUnits } from "viem";
import {
  readContract,
  writeContract,
  waitForTransactionReceipt,
} from "viem/actions";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, ExternalLink, Clock, Wallet } from "lucide-react";
import Link from "next/link";
import { ConnectButtonCustom } from "@/components/ConnectButtonCustom";
import useGetBalance from "@/hooks/getBalance";

const ERC20_ABI = [
  {
    name: "approve",
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    name: "allowance",
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export default function Payment({ id }: { id: string }) {
  const { address, chain } = useAccount();
  const { data: walletClient, isLoading } = useWalletClient();
  const [countdown, setCountdown] = React.useState<number>(0);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [txHash, setTxHash] = React.useState<string>("");

  const chainId = String(chain?.id ?? "");
  const { tokens, loading } = useGetTokens(chainId);
  const { testnetTokens } = useGetTestnetTokens();

  const { paymentLink } = useGetPaymentLink(id);
  const { business } = useGetBusinessbyID(paymentLink?.business_id);
  const { receiveToken } = useGetReceiveToken();
  const { balanceUSDC, decimalsUSDC } = useGetBalance();

  const [customerName, setCustomerName] = React.useState<string>("");
  const [selectedToken, setSelectedToken] = React.useState<TokensType | null>(
    null
  );
  const [isSending, setIsSending] = React.useState(false);

  const {
    quote,
    loading: isLoadingQuote,
    error: isErrorQuote,
  } = useGetQuote({
    fromChain: String(chain?.id),
    toChain: paymentLink?.chain_id ?? "",
    fromToken: selectedToken?.address ?? "",
    toToken: paymentLink?.recieve_token ?? "",
    fromAddress: address as `0x${string}`,
    toAddress: business?.address_wallet ?? "",
    toAmount:
      paymentLink?.amount && receiveToken?.decimals
        ? parseUnits(
            String(paymentLink.amount),
            Number(receiveToken.decimals)
          ).toString()
        : "0",
  });

  React.useEffect(() => {
    if (!chain?.id) return;

    const isValid = selectedToken && selectedToken.chainId === chain.id;
    if (isValid) return;

    if (tokens && tokens.length > 0) {
      setSelectedToken(tokens[0]);
    } else if (testnetTokens && testnetTokens.length > 0) {
      const fallback = testnetTokens[0];
      setSelectedToken({
        name: fallback.name ?? "",
        symbol: fallback.symbol ?? "",
        address: fallback.address ?? "",
        logoURI: fallback.logoURI ?? "",
        priceUSD: fallback.priceUSD ?? "0",
        decimals: fallback.decimals ?? 18,
        chainId: chain.id,
      });
    } else {
      setSelectedToken(null);
    }
  }, [chain?.id, tokens, testnetTokens, selectedToken]);

  const renderInput = (label: string, value?: React.ReactNode) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      {value ?? (
        <Input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="example: zaky"
          disabled={isPending || isConfirming || isConfirmed}
        />
      )}
    </div>
  );

  async function checkAndSetAllowance(
    tokenAddress: string,
    approvalAddress: string,
    amount: bigint
  ) {
    if (!walletClient || !address) return;

    // Skip approval for native token
    if (tokenAddress === "0x0000000000000000000000000000000000000000") {
      return;
    }

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
          <h2 className="text-xl font-semibold">Payment Successful!</h2>
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
            <div className="text-sm text-gray-600 mb-1">Payment Details</div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Amount:</span>
                <span className="font-medium">
                  {paymentLink?.amount} {selectedToken?.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>To:</span>
                <span className="font-medium">
                  {business?.address_wallet?.slice(0, 8)}...
                  {business?.address_wallet?.slice(-6)}
                </span>
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

  async function confirmPayment() {
    if (!walletClient || !quote?.transactionRequest) return;

    try {
      setIsSending(true);

      // Check and set allowance if needed
      if (selectedToken?.address && quote.estimate?.approvalAddress) {
        await checkAndSetAllowance(
          selectedToken.address,
          quote.estimate.approvalAddress,
          BigInt(quote.estimate.fromAmount)
        );
      }

      const txHash = await walletClient.sendTransaction({
        to: quote?.transactionRequest?.to as `0x${string}`,
        data: quote?.transactionRequest?.data as `0x${string}`,
        value: BigInt(quote?.transactionRequest?.value || "0"),
        gas: BigInt(quote?.transactionRequest?.gasPrice || "0"),
      });

      console.log("Transaction Hash:", txHash);
      toast.success(`Payment Hash`, {
        description: txHash,
      });

      // Update database with transaction details
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_address_wallet: address,
            customer_name: customerName,
            transaction_hash: `${chain?.blockExplorers?.default.url}/tx/${txHash}`,
            status: "paid",
            sender_chain_name: chain?.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment link");
      }

      toast.success("Payment status updated!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("Error sending transaction", err);
      toast.error(`Payment failed`);
    } finally {
      setIsSending(false);
    }
  }

  const {
    data: hash,
    error,
    isPending,
    writeContractAsync,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  async function confirmPaymentSameToken() {
    if (!walletClient || paymentLink?.recieve_token !== selectedToken?.address)
      return;

    try {
      setIsSending(true);

      // Check and set allowance if needed
      if (selectedToken?.address) {
        await checkAndSetAllowance(
          selectedToken.address,
          business?.address_wallet as `0x${string}`,
          parseUnits(
            String(paymentLink?.amount),
            Number(receiveToken?.decimals)
          )
        );
      }

      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: selectedToken?.address as `0x${string}`,
        functionName: "transfer",
        args: [
          business?.address_wallet as `0x${string}`,
          parseUnits(
            String(paymentLink?.amount),
            Number(receiveToken?.decimals)
          ),
        ],
      });

      setTxHash(hash);
      setShowSuccessModal(true);

      // Update database with transaction details
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_address_wallet: address,
            customer_name: customerName,
            transaction_hash: `${chain?.blockExplorers?.default.url}/tx/${hash}`,
            status: "paid",
            sender_chain_name: chain?.name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment link");
      }

      startCountdown();
    } catch (error) {
      console.error("Error in payment:", error);
      toast.error("Payment failed");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="col-span-1 space-y-5 border p-5 rounded-md shadow bg-white">
      {showSuccessModal && <SuccessModal />}
      {address && (
        <div className="flex justify-end">
          <ConnectButtonCustom />
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Payment Information
          </h1>
          {paymentLink?.status === "paid" && (
            <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 rounded-full">
              Paid
            </span>
          )}
        </div>

        {address ? (
          <>
            {paymentLink?.status === "paid" && (
              <div className="flex items-center gap-3 p-4 mb-2 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="text-green-600 size-7" />
                <div>
                  <div className="font-semibold text-green-700 text-lg">
                    Payment Confirmed
                  </div>
                  <div className="text-sm text-green-600">
                    Thank you! This payment has been successfully processed.
                  </div>
                </div>
              </div>
            )}

            {paymentLink?.status === "active" && (
              <>
                {!paymentLink?.customer_name && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-900">
                      Customer Details
                    </h2>
                    {renderInput("Customer Name")}
                    {renderInput(
                      "Customer Address Wallet",
                      <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {address ?? "-"}
                      </p>
                    )}
                    {renderInput("Customer Network", <NetworkList />)}
                  </div>
                )}

                {!loading ? (
                  selectedToken ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <Label className="text-base font-medium">
                          Pay With
                        </Label>
                        <TokensList
                          tokens={tokens ?? []}
                          testnetTokens={testnetTokens ?? []}
                          selectedToken={selectedToken}
                          setSelectedToken={setSelectedToken}
                        />
                      </div>

                      <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        <Label className="text-base font-medium">
                          Payment Amount
                        </Label>
                        <TokenCalculate
                          selectedToken={selectedToken}
                          quote={quote}
                          isLoadingQuote={isLoadingQuote}
                          isErrorQuote={isErrorQuote}
                          amount={paymentLink?.amount}
                          recieveToken={paymentLink?.recieve_token}
                        />
                      </div>
                    </section>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No tokens available</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Loading tokens...</p>
                  </div>
                )}

                <Review
                  quote={quote}
                  isLoadingQuote={isLoadingQuote}
                  isErrorQuote={isErrorQuote}
                  selectedToken={selectedToken}
                  recieveToken={paymentLink?.recieve_token}
                  amount={paymentLink?.amount}
                />

                {!isLoadingQuote && !isErrorQuote && (
                  <Button
                    className="w-full h-12 text-base font-medium"
                    disabled={
                      !!isErrorQuote || isSending || isLoading || !customerName
                    }
                    onClick={confirmPayment}
                  >
                    {isSending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Confirm Payment with ${selectedToken?.symbol}`
                    )}
                  </Button>
                )}
                {paymentLink?.recieve_token === selectedToken?.address && (
                  <Button
                    className="w-full h-12 text-base font-medium"
                    disabled={
                      isPending ||
                      isConfirming ||
                      isConfirmed ||
                      !customerName ||
                      Number(paymentLink.amount) >
                        Number(
                          formatUnits(
                            balanceUSDC as bigint,
                            Number(decimalsUSDC)
                          )
                        )
                    }
                    onClick={confirmPaymentSameToken}
                  >
                    {isSending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      `Confirm Payment with ${selectedToken?.symbol}`
                    )}
                  </Button>
                )}
              </>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  Error: {(error as BaseError).shortMessage || error.message}
                </p>
              </div>
            )}
            {hash && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Transaction Details:
                </p>
                <a
                  href={`${chain?.blockExplorers?.default.url}/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {hash}
                </a>
              </div>
            )}
            {paymentLink?.status === "paid" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-semibold text-green-700 mb-3">
                  Payment Details
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-600">Customer</p>
                    <p className="font-medium text-green-700">
                      {paymentLink.customer_name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Sender Wallet</p>
                    <p className="font-mono text-sm font-medium text-green-700">
                      {paymentLink.sender_address_wallet || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600">Transaction Hash</p>
                    {paymentLink.transaction_hash ? (
                      <Link
                        href={
                          chain?.blockExplorers?.default.url &&
                          paymentLink.transaction_hash
                            ? `${paymentLink.transaction_hash}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      >
                        {paymentLink.transaction_hash.slice(0, 50)}
                      </Link>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 space-y-1">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500">
              Please connect your wallet to proceed with the payment
            </p>
            <div className="pt-4">
              <ConnectButtonCustom />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
