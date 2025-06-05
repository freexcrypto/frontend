"use client";

import React from "react";
import { TokensType } from "./getTokens"; // Assuming TokensType is exported from getTokens.tsx

export type GasCostType = {
  type: string;
  price: string;
  estimate: string;
  limit: string;
  amount: string;
  amountUSD: string;
  token: TokensType;
};

export type ToolDetailsType = {
  key: string;
  name: string;
  logoURI: string;
};

export type FeeCostType = {
  name: string;
  description?: string;
  token: TokensType;
  amount: string;
  amountUSD?: string;
  percentage?: string;
  included?: boolean;
};

export type StepType = {
  id: string;
  type: string;
  action: {
    fromChainId: number;
    fromAmount: string;
    fromToken: TokensType;
    toChainId: number;
    toToken: TokensType;
    fromAddress: string;
    toAddress: string;
    slippage?: number;
    destinationGasConsumption?: string;
  };
  estimate: {
    tool: string;
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    approvalAddress: string;
    feeCosts?: FeeCostType[];
    gasCosts: GasCostType[];
    executionDuration: number;
    fromAmountUSD?: string;
    toAmountUSD?: string;
  };
  tool: string;
  toolDetails: ToolDetailsType;
};

export type QuoteType = {
  id: string;
  type: string;
  tool: string;
  toolDetails: ToolDetailsType;
  action: {
    fromChainId: number;
    fromAmount: string;
    fromToken: TokensType;
    fromAddress: string;
    toChainId: number;
    toToken: TokensType;
    toAddress: string;
    slippage: number;
  };
  estimate: {
    tool: string;
    approvalAddress: string;
    toAmountMin: string;
    toAmount: string;
    fromAmount: string;
    feeCosts?: FeeCostType[];
    gasCosts: GasCostType[];
    executionDuration: number;
    fromAmountUSD?: string;
    toAmountUSD?: string;
  };
  includedSteps: StepType[];
  integrator?: string;
  transactionRequest?: {
    value: string;
    to: string;
    data: string;
    from: string;
    chainId: number;
    gasLimit?: string;
    gasPrice?: string;
  };
};

export default function useGetQuote({
  fromChain,
  toChain,
  fromToken,
  toToken,
  fromAddress,
  toAddress,
  toAmount,
}: {
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  fromAddress: string;
  toAddress: string;
  toAmount: string;
}) {
  const [quote, setQuote] = React.useState<QuoteType | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const shouldFetch =
      fromChain &&
      toChain &&
      fromToken &&
      toToken &&
      toAddress &&
      fromAddress &&
      toAmount;

    if (!shouldFetch) {
      setQuote(null);
      setError(null);
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://li.quest/v1/quote/toAmount?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAddress=${fromAddress}&toAddress=${toAddress}&toAmount=${toAmount}&order=CHEAPEST`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorBody = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          throw new Error(
            `Failed to fetch quote: ${errorBody.message || response.statusText}`
          );
        }

        const data: QuoteType = await response.json();
        setQuote(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [
    fromChain,
    toChain,
    fromToken,
    toToken,
    toAddress,
    fromAddress,
    toAmount,
  ]);

  return { quote, loading, error };
}
