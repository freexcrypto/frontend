"use client";

import React from "react";

export type TokensType = {
  chainId?: number;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  priceUSD: string;
  coinKey?: string;
  logoURI: string;
};

const STABLECOIN_SYMBOLS = [
  "USDC",
  "USDT",
  "DAI",
  "FRAX",
  "TUSD",
  "USDP",
  "GUSD",
];

export default function useGetTokens(chain_id: string | undefined) {
  const [tokens, setTokens] = React.useState<TokensType[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!chain_id) return;

    const fetchTokens = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://li.quest/v1/tokens?chains=${chain_id}&minPriceUSD=0.9`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();

        const tokensForChain = data?.tokens?.[chain_id];

        if (tokensForChain) {
          const stablecoins = tokensForChain.filter((token: TokensType) =>
            STABLECOIN_SYMBOLS.includes(token.symbol.toUpperCase())
          );
          setTokens(stablecoins);
        } else {
          setTokens(null);
        }

        setLoading(false);
      } catch (error) {
        setError(error as Error);
        setLoading(false);
      }
    };

    fetchTokens();
  }, [chain_id]);

  return { tokens, loading, error };
}
