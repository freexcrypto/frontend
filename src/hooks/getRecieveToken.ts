import { baseSepolia, arbitrumSepolia, base, arbitrum } from "viem/chains";
import { useAccount } from "wagmi";

export type ReceiveTokenType = {
  name: string;
  address: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  priceUSD?: string;
};

const logoUSDC =
  "https://s3.coinmarketcap.com/static-gravity/image/5a8229787b5e4c809b5914eef709b59a.png";

const TOKEN_MAP: Record<number, ReceiveTokenType> = {
  [baseSepolia.id]: {
    name: "USDC",
    symbol: "USDC",
    address: "0x1E59c7Efa1cbcFe6eb14646Ba8Dbe0b4a30e9431",
    decimals: 18,
    priceUSD: "1",
    logoURI: logoUSDC,
  },
  [arbitrumSepolia.id]: {
    name: "USDC",
    symbol: "USDC",
    address: "0x1E59c7Efa1cbcFe6eb14646Ba8Dbe0b4a30e9431",
    decimals: 18,
    priceUSD: "1",
    logoURI: logoUSDC,
  },
  [base.id]: {
    name: "USDC",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    logoURI: logoUSDC,
  },
  [arbitrum.id]: {
    name: "USDC",
    symbol: "USDC",
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    decimals: 6,
    logoURI: logoUSDC,
  },
};

export const useGetReceiveToken = () => {
  const { chain } = useAccount();
  const chainId = chain?.id;

  const receiveToken: ReceiveTokenType | undefined = chainId
    ? TOKEN_MAP[chainId]
    : undefined;

  return { receiveToken };
};
