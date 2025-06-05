import { Label } from "@/components/ui/label";
import { QuoteType } from "@/hooks/getQuote";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUnits } from "viem";

export default function Review({
  quote,
  isLoadingQuote,
  isErrorQuote,
}: {
  quote: QuoteType | null;
  isLoadingQuote: boolean;
  isErrorQuote: string | null;
}) {
  if (!quote || isLoadingQuote || isErrorQuote) return null;

  return (
    <section className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground">Provider</Label>
        <div className="flex items-center">
          <Avatar className="size-7">
            <AvatarImage src={quote.toolDetails.logoURI} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>{" "}
          <p>{quote.toolDetails?.name ?? quote.tool}</p>
        </div>
      </div>

      {(quote.estimate.fromAmountUSD || quote.estimate.toAmountUSD) && (
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground">Estimated USD Value</Label>
          <p>
            ${quote.estimate.fromAmountUSD ?? "0"} → $
            {quote.estimate.toAmountUSD ?? "0"}
          </p>
        </div>
      )}

      {quote.estimate.feeCosts?.map((fee, i) => (
        <div key={i} className="flex items-center justify-between">
          <Label className="text-muted-foreground">{fee.name}</Label>
          <p>
            {fee.amount} {fee.token.symbol}
            {fee.amountUSD ? ` ($${fee.amountUSD})` : ""}
          </p>
        </div>
      ))}

      {quote.estimate.gasCosts?.map((gas, i) => (
        <div key={i} className="flex items-center justify-between">
          <Label className="text-muted-foreground">Gas ({gas.type})</Label>
          <p>
            {formatUnits(BigInt(gas.amount), Number(gas.token.decimals))}{" "}
            {gas.token.symbol}
            {gas.amountUSD ? ` ($${gas.amountUSD})` : ""}
          </p>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground">Estimated Duration</Label>
        <p>{quote.estimate.executionDuration} sec</p>
      </div>

      <div className="flex items-center justify-between">
        <Label className="font-bold">Total Amount Payment</Label>
        <p className="font-bold">
          {formatUnits(
            BigInt(quote.estimate.toAmountMin),
            Number(quote.action.toToken.decimals)
          )}{" "}
          {quote.action.toToken.symbol}
        </p>
      </div>
    </section>
  );
}
