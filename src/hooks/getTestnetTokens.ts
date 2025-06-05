import { baseSepolia, arbitrumSepolia } from "viem/chains";
import { useAccount } from "wagmi";

export type TestnetTokenType = {
  name: string;
  address: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  priceUSD?: string;
};

const logoUSDC =
  "https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png";

const TOKEN_MAP: Record<number, TestnetTokenType[]> = {
  [baseSepolia.id]: [
    {
      name: "USDC",
      symbol: "USDC",
      address: "0x1E59c7Efa1cbcFe6eb14646Ba8Dbe0b4a30e9431",
      decimals: 18,
      priceUSD: "1",
      logoURI: logoUSDC,
    },
  ],
  [arbitrumSepolia.id]: [
    {
      name: "USDC",
      symbol: "USDC",
      address: "0x1E59c7Efa1cbcFe6eb14646Ba8Dbe0b4a30e9431",
      decimals: 18,
      priceUSD: "1",
      logoURI: logoUSDC,
    },
  ],
};

export const useGetTestnetTokens = () => {
  const { chainId } = useAccount();

  const testnetTokens = chainId ? TOKEN_MAP[chainId] ?? [] : [];

  return { testnetTokens };
};
