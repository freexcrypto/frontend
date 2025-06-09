import { Label } from "@/components/ui/label";
import { QuoteType } from "@/hooks/getQuote";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUnits } from "viem";
import { TokensType } from "@/hooks/getTokens";

interface ReviewProps {
  quote: QuoteType | null;
  isLoadingQuote: boolean;
  isErrorQuote: string | null;
  selectedToken: TokensType | null;
  recieveToken: string | undefined;
  amount: number | undefined;
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

export default function Review({
  quote,
  isLoadingQuote,
  isErrorQuote,
  selectedToken,
  recieveToken,
  amount,
}: ReviewProps) {
  // Early return conditions
  if (recieveToken === selectedToken?.address) {
    return (
      <div>
        <InfoRow label="Estimated Duration" value={"< 3 Sec"} />
        <InfoRow label="Total Amount Payment" value={amount} isBold />
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  if (isLoadingQuote) {
    return <p className="text-muted-foreground">Loading quote...</p>;
  }

  if (isErrorQuote) {
    return <p className="text-destructive">Error: {isErrorQuote}</p>;
  }

  const formatAmount = (amount: string, decimals: number, symbol: string) => {
    try {
      return `${formatUnits(BigInt(amount), decimals)} ${symbol}`;
    } catch (error) {
      console.error(error);
      return "0";
    }
  };

  return (
    <section className="space-y-2">
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

      {(quote.estimate.fromAmountUSD || quote.estimate.toAmountUSD) && (
        <InfoRow
          label="Estimated USD Value"
          value={`$${quote.estimate.fromAmountUSD ?? "0"} → $${
            quote.estimate.toAmountUSD ?? "0"
          }`}
        />
      )}

      {quote.estimate.feeCosts?.map((fee, i) => (
        <InfoRow
          key={`fee-${i}`}
          label={fee.name}
          value={`${fee.amount} ${fee.token.symbol}${
            fee.amountUSD ? ` ($${fee.amountUSD})` : ""
          }`}
        />
      ))}

      {quote.estimate.gasCosts?.map((gas, i) => (
        <InfoRow
          key={`gas-${i}`}
          label={`Gas (${gas.type})`}
          value={`${formatUnits(
            BigInt(gas.amount),
            Number(gas.token.decimals)
          )} ${gas.token.symbol}${gas.amountUSD ? ` ($${gas.amountUSD})` : ""}`}
        />
      ))}

      <InfoRow
        label="Estimated Duration"
        value={`${quote.estimate.executionDuration} sec`}
      />

      <InfoRow
        label="Total Amount Payment"
        value={formatAmount(
          quote.estimate.toAmountMin,
          Number(quote.action.toToken.decimals),
          quote.action.toToken.symbol
        )}
        isBold
      />
    </section>
  );
}
