"use client";
import React from "react";
import { useAccount, useWalletClient } from "wagmi";
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
import { parseUnits } from "viem";
import Review from "./Review";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Payment({ id }: { id: string }) {
  const { address, chain } = useAccount();
  const { data: walletClient, isLoading } = useWalletClient();

  const chainId = String(chain?.id ?? "");
  const { tokens, loading } = useGetTokens(chainId);
  const { testnetTokens } = useGetTestnetTokens();

  const { paymentLink } = useGetPaymentLink(id);
  const { business } = useGetBusinessbyID(paymentLink?.business_id);
  const { receiveToken } = useGetReceiveToken();

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

  // Auto-select token based on network
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
      {value ?? <Input />}
    </div>
  );

  // if (!paymentLink || !business) {
  //   return (
  //     <section className="border p-5 rounded-md shadow">
  //       <p className="text-red-500 text-sm">Failed to load payment data.</p>
  //     </section>
  //   );
  // }

  async function confirmPayment() {
    if (!walletClient || !quote?.transactionRequest) return;

    try {
      const txHash = await walletClient.sendTransaction({
        to: quote?.transactionRequest?.to as `0x${string}`,
        data: quote?.transactionRequest?.data as `0x${string}`,
        value: BigInt(quote?.transactionRequest?.value || "0"),
        gas: BigInt(quote?.transactionRequest?.gasPrice || "0"),
      });
      console.log("Transaction Hash:", txHash);
    } catch (err) {
      console.error("Error sending transaction", err);
      toast.error(`Payment failed`);
    }
    setIsSending(false);
  }

  return (
    <section className="col-span-1 space-y-5 border p-5 rounded-md shadow">
      <h1 className="text-xl font-medium">Payment Confirmation</h1>

      {renderInput("Customer Name")}
      {renderInput("Customer Address Wallet", <p>{address ?? "-"}</p>)}
      {renderInput("Customer Network", <NetworkList />)}

      {!loading ? (
        selectedToken ? (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label>Pay With</Label>
              <TokensList
                tokens={tokens ?? []}
                testnetTokens={testnetTokens ?? []}
                selectedToken={selectedToken}
                setSelectedToken={setSelectedToken}
              />
            </div>

            <div className="space-y-3">
              <Label>Customer Pay</Label>
              <TokenCalculate
                selectedToken={selectedToken}
                quote={quote}
                isLoadingQuote={isLoadingQuote}
                isErrorQuote={isErrorQuote}
              />
            </div>
          </section>
        ) : (
          <p className="text-sm text-muted-foreground">No tokens available</p>
        )
      ) : (
        <p className="text-sm text-muted-foreground">Loading tokens...</p>
      )}

      <Review
        quote={quote}
        isLoadingQuote={isLoadingQuote}
        isErrorQuote={isErrorQuote}
      />

      {!isLoadingQuote && !isErrorQuote && (
        <Button
          className="w-full"
          disabled={!!isErrorQuote || isSending || isLoading}
          onClick={confirmPayment}
        >
          {isSending
            ? "Sending..."
            : `Confirm Payment with ${selectedToken?.symbol}`}
        </Button>
      )}
    </section>
  );
}
