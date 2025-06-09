import { QuoteType } from "@/hooks/getQuote";
import { TokensType } from "@/hooks/getTokens";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { formatUnits } from "viem";

export default function TokenCalculate({
  selectedToken,
  quote,
  isLoadingQuote,
  isErrorQuote,
  amount,
  recieveToken,
}: {
  selectedToken: TokensType;
  quote: QuoteType | null;
  isLoadingQuote: boolean;
  isErrorQuote: string | null;
  amount: number | undefined;
  recieveToken: string | undefined;
}) {
  if (!selectedToken) return <div>Select Token</div>;

  if (isErrorQuote && recieveToken !== selectedToken.address)
    return (
      <div className="border p-3 rounded-md space-y-2">
        <p className="text-sm text-destructive">{isErrorQuote}</p>
      </div>
    );

  return (
    <div className="border p-3 rounded-md space-y-2">
      <div className="flex items-center gap-2">
        <Image
          src={
            selectedToken.logoURI || "https://www.ledr.com/colours/white.jpg"
          }
          alt={selectedToken.symbol}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div>
          <div className="font-bold">
            {isLoadingQuote ? (
              <span className="flex items-center gap-1">
                <span>Calculate Amount</span>{" "}
                <Loader2 className="animate-spin" size={20} />
              </span>
            ) : isErrorQuote ? (
              <span>{amount}</span>
            ) : (
              formatUnits(
                BigInt(quote?.estimate.fromAmount ?? "0"),
                selectedToken.decimals
              )
            )}
          </div>
          <div className="text-muted-foreground text-sm">
            {isLoadingQuote ? null : isErrorQuote ? (
              <span> ~$ {amount}</span>
            ) : (
              <span> ~$ {quote?.estimate.fromAmountUSD}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
