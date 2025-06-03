"use client";
import React from "react";

type TokensType = {
  chainId: number;
  address: string;
  symbol: string;
  name: string;
  decimals: string;
  priceUSD: string;
  coinKey: string;
  logoURI: string;
};

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
          `https://li.quest/v1/tokens?chains=${chain_id}`,
          {
            cache: "no-store",
          }
        );
        const data = await response.json();
        setTokens(data?.tokens?.chain_id);
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
