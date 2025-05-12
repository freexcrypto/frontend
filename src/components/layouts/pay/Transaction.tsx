"use client";
import React, { useState, useEffect, useRef } from "react";
import useGetPaymentLink from "@/hooks/getPaymentLink";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  injected,
  useAccount,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  IDRX_CONTRACT_ABI,
  IDRX_CONTRACT_ADDRESS,
} from "@/config/IdrxContract";
import { parseUnits } from "viem";
import Link from "next/link";
import { liskSepolia } from "viem/chains";
import { TransferContractABI } from "@/config/TransferContract";
import { TransferContract } from "@/config/TransferContract";

export default function Transaction({ id }: { id: string }) {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();

  React.useEffect(() => {
    switchChain({ chainId: liskSepolia.id });
  }, [switchChain]);

  const {
    paymentLink,
    loading: paymentLinkLoading,
    error: paymentLinkError,
  } = useGetPaymentLink(id);
  const {
    business,
    loading: businessLoading,
    error: businessError,
  } = useGetBusinessbyID(paymentLink?.business_id || "");

  // State for customer name input
  const [customerName, setCustomerName] = useState("");
  const [paying, setPaying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [txError, setTxError] = useState<string | undefined>(undefined);

  // Calculate payment processing fee
  const paymentProcessingFee = paymentLink
    ? (Number(paymentLink.amount) * 0.1) / 100
    : 0;
  const totalAmount = paymentLink
    ? Number(paymentLink.amount) + paymentProcessingFee
    : 0;

  // Hooks for contract interaction (must not be called conditionally)
  const { writeContractAsync } = useWriteContract();

  const { data: receipt, isLoading: receiptLoading } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Prevent duplicate API calls for the same transaction
  const hasUpdatedDb = useRef(false);

  useEffect(() => {
    if (receipt && txHash && !hasUpdatedDb.current) {
      hasUpdatedDb.current = true;
      // Update payment link in database
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment-link/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_address_wallet: address,
          customer_name: customerName,
          transaction_hash: txHash,
          status: "paid",
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to update payment link");
          toast.success("Payment status updated!");
        })
        .catch((err) => {
          toast.error("Failed to update payment status: " + err.message);
        });
    }
    // Reset flag if txHash changes (new transaction)
    if (!receipt) hasUpdatedDb.current = false;
  }, [receipt, txHash, id, address, customerName]);

  // Handle Pay button click
  async function handlePay() {
    if (!customerName.trim()) {
      toast.error("Please enter your name before proceeding.");
      return;
    }
    setPaying(true);
    setTxError(undefined);
    setTxHash(undefined);
    try {
      // Approve contract to spend tokens
      await writeContractAsync({
        address: IDRX_CONTRACT_ADDRESS,
        abi: IDRX_CONTRACT_ABI,
        functionName: "approve",
        args: [TransferContract, parseUnits(totalAmount.toString(), 2)],
      });
      // Transfer tokens
      const hash = await writeContractAsync({
        address: TransferContract,
        abi: TransferContractABI,
        functionName: "splitTransfer",
        args: [
          address,
          business?.address_wallet,
          parseUnits(totalAmount.toString(), 2),
        ],
      });
      setTxHash(hash as `0x${string}`);
      toast.success("Transaction submitted!");
    } catch (error) {
      const errMsg =
        (error instanceof Error ? error.message : String(error)) ||
        "Payment failed. Please try again.";
      setTxError(errMsg);
      toast.error(errMsg);
    } finally {
      setPaying(false);
    }
  }

  // Show loading state
  if (paymentLinkLoading || businessLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="size-6 animate-spin" />
        <span className="ml-2 text-muted-foreground">
          Loading transaction...
        </span>
      </div>
    );
  }

  // Show error state
  if (paymentLinkError || businessError) {
    return (
      <div className="p-5 text-destructive">
        {paymentLinkError && (
          <div>Error loading payment link: {paymentLinkError.message}</div>
        )}
        {businessError && (
          <div>Error loading business: {businessError.message}</div>
        )}
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5 ">
      {paymentLink?.status === "paid" && (
        <div className="flex items-center gap-2 p-4 mb-2 bg-green-50 border border-green-200 rounded-md max-w-sm">
          <CheckCircle2 className="text-green-600 size-6" />
          <div>
            <div className="font-bold text-green-700">Payment Confirmed</div>
            <div className="text-xs text-green-700">
              Thank you! This payment has been successfully processed.
            </div>
          </div>
        </div>
      )}
      <h1 className="text-2xl font-bold">Transaction</h1>
      <p className="text-muted-foreground text-sm">
        ID Payment: <strong className="text-primary">{id}</strong>
      </p>

      <section className="space-y-2">
        <h1 className="text-lg font-bold">Customer Information</h1>
        {paymentLink?.customer_name && (
          <p>
            Customer Name: <strong>{paymentLink.customer_name}</strong>
          </p>
        )}
        {!paymentLink?.customer_name && (
          <div className="space-y-2">
            <Label htmlFor="customer-name">Name</Label>
            <Input
              id="customer-name"
              className="max-w-sm"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              disabled={
                paying || receiptLoading || paymentLink?.status === "paid"
              }
            />
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h1 className="text-lg font-bold">Transaction Information</h1>
        <p>
          Network: <strong>{chain?.name}</strong>
        </p>
        <div className="border shadow-md p-5 rounded-md max-w-sm space-y-2">
          <div>
            <p>From</p>
            {!paymentLink?.sender_address_wallet && (
              <p className="text-primary font-bold">
                {address?.slice(0, 6)}...{address?.slice(-6)} (Your Wallet)
              </p>
            )}
            {paymentLink?.sender_address_wallet && (
              <p className="text-primary font-bold">
                {paymentLink.sender_address_wallet?.slice(0, 6)}...
                {paymentLink.sender_address_wallet?.slice(-6)} (Sender Wallet)
              </p>
            )}
          </div>
          <div>
            <p>To</p>
            <p className="text-primary font-bold">
              {business?.address_wallet?.slice(0, 6)}...
              {business?.address_wallet?.slice(-6)} ({business?.nama || "-"})
            </p>
          </div>
          <div>
            <p>Amount</p>
            <p className="text-primary font-bold">{totalAmount} IDRX</p>
          </div>
          {txError && <div className="text-destructive text-sm">{txError}</div>}
          {txHash && (
            <div className="text-xs break-all">
              Tx Hash:{" "}
              <a
                href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {txHash}
              </a>
            </div>
          )}
          {receiptLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Waiting for
              confirmation...
            </div>
          )}
          {receipt && (
            <div className="text-green-600 text-sm">Transaction confirmed!</div>
          )}
          {paymentLink?.status === "paid" && (
            <div className="bg-green-100 border border-green-300 rounded-md p-3 mt-2">
              <div className="font-semibold text-green-700 mb-1">
                Payment Details
              </div>
              <div className="text-xs text-green-700">
                Customer: {paymentLink.customer_name || "-"}
              </div>
              <div className="text-xs text-green-700">
                Sender Wallet: {paymentLink.sender_address_wallet || "-"}
              </div>
              <div className="text-xs text-green-700">
                Tx Hash:{" "}
                {paymentLink.transaction_hash ? (
                  <Link
                    href={`https://sepolia-blockscout.lisk.com/tx/${paymentLink.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {paymentLink.transaction_hash.slice(0, 6)}...
                    {paymentLink.transaction_hash.slice(-6)}
                  </Link>
                ) : (
                  "-"
                )}
              </div>
            </div>
          )}
          {isConnected || paymentLink?.status === "paid" ? (
            paymentLink?.status === "paid" ? (
              <Button className="w-full" disabled variant="secondary">
                <CheckCircle2 className="size-4 mr-2" /> Payment already
                confirmed
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handlePay}
                disabled={
                  paying ||
                  !customerName.trim() ||
                  receiptLoading ||
                  receipt?.status === "success"
                }
              >
                {paying || receiptLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    {receiptLoading
                      ? "Waiting for confirmation..."
                      : "Processing..."}
                  </span>
                ) : (
                  "Confirm Payment"
                )}
              </Button>
            )
          ) : (
            <Button
              className="w-full"
              onClick={() => connect({ connector: injected() })}
            >
              Connect your wallet to pay
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
