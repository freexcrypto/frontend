"use client";
import React, { useState, useEffect, useRef } from "react";
import useGetBusinessbyID from "@/hooks/getBusinessbyID";

import {
  // injected,
  useAccount,
  // useConnect,
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
  IDRX_CONTRACT_ADDRESS_BASE,
} from "@/config/IdrxContract";
import { parseUnits } from "viem";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TransferContract_BASE,
  TransferContractABI,
} from "@/config/TransferContract";
import { TransferContract } from "@/config/TransferContract";
import { ConnectButtonCustom } from "@/components/ConnectButtonCustom";
import useGetOrderbyId from "@/hooks/getOrderbyId";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QRCodeSVG } from "qrcode.react";

const CHAIN_CONFIG: Record<
  number,
  {
    tokenContract: `0x${string}`;
    transferContract: `0x${string}`;
    explorer: string;
    name: string;
  }
> = {
  4202: {
    tokenContract: IDRX_CONTRACT_ADDRESS as `0x${string}`,
    transferContract: TransferContract as `0x${string}`,
    explorer: "https://sepolia-blockscout.lisk.com",
    name: "Lisk Sepolia",
  },
  84532: {
    tokenContract: IDRX_CONTRACT_ADDRESS_BASE as `0x${string}`,
    transferContract: TransferContract_BASE as `0x${string}`,
    explorer: "https://base-sepolia.blockscout.com",
    name: "Base Sepolia",
  },
};

export default function Transaction({ id }: { id: string }) {
  const { address, isConnected, chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  const {
    order,
    loading: orderLoading,
    error: orderError,
  } = useGetOrderbyId(id);
  const {
    business,
    loading: businessLoading,
    error: businessError,
  } = useGetBusinessbyID(order?.business_id);

  // State for customer name input
  //   const [customerName, setCustomerName] = useState("");
  const [paying, setPaying] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [txError, setTxError] = useState<string | undefined>(undefined);

  const [tokenContract, setTokenContract] = useState<`0x${string}`>();
  const [transferContract, setTransferContract] = useState<`0x${string}`>();
  const [explorer, setExplorer] = useState<string>("");

  // Set contracts and explorer based on chain
  useEffect(() => {
    if (chain?.id && CHAIN_CONFIG[chain.id]) {
      setTokenContract(CHAIN_CONFIG[chain.id].tokenContract);
      setTransferContract(CHAIN_CONFIG[chain.id].transferContract);
      setExplorer(CHAIN_CONFIG[chain.id].explorer);
    } else {
      setTokenContract(undefined);
      setTransferContract(undefined);
      setExplorer("");
    }
  }, [chain]);

  // Calculate payment processing fee
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [usdValue, setUsdValue] = useState<number | null>(null);

  // Fetch USD/IDR rate on mount
  useEffect(() => {
    async function fetchRate() {
      try {
        const res = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await res.json();
        setUsdRate(data.rates.IDR); // USD to IDR
      } catch {
        setUsdRate(null);
      }
    }
    fetchRate();
  }, []);

  // Calculate IDRX value when order or rate changes
  useEffect(() => {
    if (usdRate && order?.total_price) {
      setUsdValue(Number(order.total_price) * usdRate); // USD to IDRX
    } else {
      setUsdValue(null);
    }
  }, [usdRate, order?.total_price]);

  const paymentProcessingFee = order ? (Number(usdValue) * 0.1) / 100 : 0;
  const totalAmount = order ? Number(usdValue) + paymentProcessingFee : 0;

  // Hooks for contract interaction (must not be called conditionally)
  const { writeContractAsync } = useWriteContract();

  const { data: receipt, isLoading: receiptLoading } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Prevent duplicate API calls for the same transaction
  const hasUpdatedDb = useRef(false);
  const [redirecting, setRedirecting] = useState(false); // New state for redirect UI
  const [redirectCountdown, setRedirectCountdown] = useState(5); // Countdown for UI

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout | undefined;
    let redirectTimeout: NodeJS.Timeout | undefined;
    if (redirecting) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      redirectTimeout = setTimeout(() => {
        window.location.href = String(order?.success_url);
      }, 5000);
    }
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [redirecting, order?.success_url]);

  useEffect(() => {
    if (receipt && txHash && !hasUpdatedDb.current) {
      hasUpdatedDb.current = true;
      // Update payment link in database
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/order/update-status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            sender_address_wallet: address,
            //   customer_name: customerName,
            status_message: "paid",
            transaction_hash:
              explorer && txHash ? `${explorer}/tx/${txHash}` : "", // Only the hash
          }),
        }
      )
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to update payment link");
          toast.success("Payment status updated!");
          setRedirecting(true); // Start redirect process
        })
        .catch((err) => {
          toast.error("Failed to update payment status: " + err.message);
        });
    }
    // Reset flag if txHash changes (new transaction)
    if (!receipt) hasUpdatedDb.current = false;
  }, [receipt, txHash, id, address, order?.success_url, explorer]);

  // Handle Pay button click
  async function handlePay() {
    // if (!customerName.trim()) {
    //   toast.error("Please enter your name before proceeding.");
    //   return;
    // }
    setPaying(true);
    setTxError(undefined);
    setTxHash(undefined);
    try {
      // Approve contract to spend tokens
      await writeContractAsync({
        address: tokenContract as `0x${string}`,
        abi: IDRX_CONTRACT_ABI,
        functionName: "approve",
        args: [
          transferContract as `0x${string}`,
          parseUnits(totalAmount.toString(), 2),
        ],
      });
      // Transfer tokens
      const hash = await writeContractAsync({
        address: transferContract as `0x${string}`,
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
  if (orderLoading || businessLoading) {
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
  if (orderError || businessError) {
    return (
      <div className="p-5 text-destructive">
        {orderError && <div>Error loading order: {orderError.message}</div>}
        {businessError && (
          <div>Error loading business: {businessError.message}</div>
        )}
      </div>
    );
  }

  const config = chain?.id ? CHAIN_CONFIG[chain.id] : undefined;
  const isSupportedNetwork = !!config;

  const qrValue = `https://www.freexcrypto.xyz/checkout/${id}`;

  return (
    <div className="p-5 space-y-5 border shadow-md rounded-md max-w-sm">
      {redirecting && (
        <div className="flex items-center gap-2 p-4 mb-2 bg-blue-50 border border-blue-200 rounded-md max-w-sm">
          <Loader2 className="text-blue-600 size-6 animate-spin" />
          <div>
            <div className="font-bold text-blue-700">
              Payment status updated!
            </div>
            <div className="text-xs text-blue-700">
              Redirecting in {redirectCountdown} second
              {redirectCountdown !== 1 ? "s" : ""}...
            </div>
          </div>
        </div>
      )}
      {order?.status_message === "paid" && (
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
      <h1 className="text-2xl font-bold">Payment Transaction</h1>
      <p className="text-muted-foreground text-sm">
        ID Payment: <strong className="text-primary">{id}</strong>
      </p>

      {/* <section className="space-y-2">
        <h1 className="text-lg font-bold">Customer Information</h1>
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
      </section> */}

      <section className="space-y-2">
        <h1 className="text-lg font-bold">Transaction Information</h1>
        {!order?.transaction_hash && receipt && (
          <>
            <div>
              <p>
                Network:{" "}
                <strong>{chain?.name || config?.name || "Unknown"}</strong>
              </p>
              <Select
                onValueChange={(value) =>
                  switchChain({ chainId: Number(value) })
                }
              >
                <SelectTrigger className="w-[180px]">
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
            </div>
            <>
              {!isSupportedNetwork && (
                <div className="text-xs text-destructive mt-2">
                  Please switch to a supported network.
                </div>
              )}
            </>
          </>
        )}

        <div>
          <p>From</p>
          {!order?.sender_address_wallet && (
            <div className="text-primary font-bold">
              {address ? (
                <p>
                  {address?.slice(0, 6)}...{address?.slice(-6)} (Your Wallet)
                </p>
              ) : (
                <p>Connect your Account</p>
              )}
            </div>
          )}
        </div>
        {order?.sender_address_wallet && (
          <p className="text-primary font-bold">
            {order.sender_address_wallet?.slice(0, 6)}...
            {order.sender_address_wallet?.slice(-6)} (Sender Wallet)
          </p>
        )}

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
              href={`${explorer}/tx/${txHash}`}
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
        {order?.status_message === "paid" && (
          <div className="bg-green-100 border border-green-300 rounded-md p-3 mt-2">
            <div className="font-semibold text-green-700 mb-1">
              Payment Details
            </div>
            <div className="text-xs text-green-700">
              Customer: {order.client_id || "-"}
            </div>
            <div className="text-xs text-green-700">
              Sender Wallet: {order.sender_address_wallet || "-"}
            </div>
            <div className="text-xs text-green-700">
              Tx Hash:{" "}
              {order.transaction_hash ? (
                <Link
                  href={`${order.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {order.transaction_hash.slice(0, 6)}...
                  {order.transaction_hash.slice(-6)}
                </Link>
              ) : (
                "-"
              )}
            </div>
          </div>
        )}
        {isConnected || order?.status_message === "paid" ? (
          order?.status_message === "paid" ? (
            <Button className="w-full" disabled variant="secondary">
              <CheckCircle2 className="size-4 mr-2" /> Payment already confirmed
            </Button>
          ) : (
            <Button
              // className="w-full"
              onClick={handlePay}
              disabled={
                paying ||
                // !customerName.trim() ||
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
                <>
                  {order?.status_message === "paid"
                    ? "Payment already confirmed"
                    : "Confirm Payment"}
                </>
              )}
            </Button>
          )
        ) : (
          <ConnectButtonCustom />
        )}
        {/* Only show QR code payment option if not paid */}
        {order?.status_message !== "paid" && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">
                Pay with QR Code (optional)
              </AccordionTrigger>
              <AccordionContent className="flex flex-col items-center gap-2">
                <QRCodeSVG value={qrValue} />
                <span className="text-xs text-muted-foreground text-center">
                  Scan this QR code with your wallet app to pay from your phone
                </span>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </section>
    </div>
  );
}
