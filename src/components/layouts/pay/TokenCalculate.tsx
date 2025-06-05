import { QuoteType } from "@/hooks/getQuote";
import { TokensType } from "@/hooks/getTokens";
import Image from "next/image";
import React from "react";
import { formatUnits } from "viem";

export default function TokenCalculate({
  selectedToken,
  quote,
  isLoadingQuote,
  isErrorQuote,
}: {
  selectedToken: TokensType;
  quote: QuoteType | null;
  isLoadingQuote: boolean;
  isErrorQuote: string | null;
}) {
  if (!selectedToken) return <div>Select Token</div>;

  if (isErrorQuote)
    return (
      <p className="p-3 text-sm">
        This token not supported, select others token.
      </p>
    );

  return (
    <div className="border p-3 rounded-md space-y-2">
      <div className="flex items-center gap-2">
        <Image
          src={selectedToken.logoURI}
          alt={selectedToken.symbol}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div>
          <p className="font-bold">
            {isLoadingQuote
              ? "Calculate"
              : formatUnits(
                  BigInt(quote?.estimate.fromAmount ?? "0"),
                  selectedToken.decimals
                )}
          </p>
          <p className="text-muted-foreground text-sm">
            ~ ${isLoadingQuote ? "Calculate" : quote?.estimate.fromAmountUSD}
          </p>
        </div>
      </div>
    </div>
  );
}
