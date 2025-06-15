import { base, arbitrum } from "viem/chains";
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

export const TOKEN_MAP: Record<number, ReceiveTokenType> = {
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
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
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
